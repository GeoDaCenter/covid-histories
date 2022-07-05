import { FileListReturn } from './types'
import { SubmissionType } from './types'
import { nanoid } from '@reduxjs/toolkit'
import { CopyObjectCommand, DeleteObjectCommand, ListObjectsCommand, ListObjectsCommandOutput, S3Client, GetObjectCommand, PutObjectCommand, GetObjectTaggingCommandOutput, GetObjectTaggingCommand, Tag, PutObjectTaggingCommand, PutObjectTaggingCommandOutput, PutObjectCommandInput, PutObjectCommandOutput } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import 'dotenv/config'

// constants
const config = {
	REGION: process.env.APP_AWS_REGION,
	STAGE: 'dev',
	S3_BUCKET: process.env.APP_AWS_BUCKET
}
const URL_EXPIRATION_SECONDS = 60 * 5
const TAG_FILTER_PREDICATES = {
	'unreviewed': (t: Tag, _index: number, _array: Tag[]) => t.Key === 'reviewed' && t.Value === 'false',
	'rejected': (t: Tag, _index: number, _array: Tag[]) => t.Key === 'approved' && t.Value === 'false',
	'approved': (t: Tag, _index: number, _array: Tag[]) => t.Key === 'approved' && t.Value === 'true',
	'all': () => true
}
const fileExtensionMap: { [fileType: string]: string } = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/tiff': '.tiff',
	'image/gif': '.gif',
	'image/bmp': '.bmp',
	'audio/webm': '.webm',
	'video/webm': '.webm',
	'text/markdown': '.md',
	'application/json': '_meta.json',
}
// helpers 

export const onlyUnique = (value: string, index: number, self: string[]) => self.indexOf(value) === index

// types
export type TagFilter = 'unreviewed' | 'approved' | 'rejected' | 'all'
export interface UploadInfo {
	Key: string | undefined
	fileId: string | undefined
	LastModified: Date  | undefined
}


export const getFileList = async (
	s3: S3Client,
	Bucket: string,
	Prefix: string
): Promise<ListObjectsCommandOutput | undefined> => {
	try {
		const command = new ListObjectsCommand({
			Bucket,
			Prefix
		})
		const response = await s3.send(command)
		return response
	} catch (err) {
		console.log('Error', err)
	}
}

export const getObjectTags = async (
	s3: S3Client,
	Bucket: string,
	Key: string
): Promise<GetObjectTaggingCommandOutput | undefined> => {
	const command = new GetObjectTaggingCommand({
		Bucket,
		Key
	})
	const response = await s3.send(command)
	return response
}

export const setObjectTagging = async (
	s3: S3Client,
	Bucket: string,
	Key: string,
	Tags: Tag[]
): Promise<PutObjectTaggingCommandOutput | undefined> => {
	const command = new PutObjectTaggingCommand({
		Bucket,
		Key,
		Tagging: {
			TagSet: Tags
		}
	})
	const response = await s3.send(command)
	return response		
}


export const getTaggedFileList = async (
	s3: S3Client,
	Bucket: string,
	tagFilter: TagFilter
): Promise<UploadInfo[] | undefined> => {
	const prefix = `uploads/`
	const currentFiles: ListObjectsCommandOutput | undefined = await getFileList(s3, Bucket, prefix)
	const fileNames = currentFiles
		? currentFiles?.Contents?.map(({ Key, LastModified }) => ({
				Key,
				fileId: Key?.split('uploads/')[1]?.split('.')[0],
				LastModified
		  }))
		: []
		
	const entriesToReview = fileNames
		?.filter((f) => {
			// to be ignored
			if (
				!f.Key ||
				!f.LastModified ||
				!f.fileId ||
				f.Key.includes('_meta.json') ||
				f.Key === 'uploads/'
			) {
				return false
			}
			const fileId = f.fileId || 'PLACEHOLDER_INVALID_KEY'
			// image submission with description
			if (
				f.Key.includes('.md') &&
				fileNames.filter((f) => f.Key && f.Key.includes(fileId)).length > 2
			) {
				return false
			}
			//  otherwise, a valid submission
			return true
		}) //@ts-ignore
		.sort((a, b) => b.LastModified - a.LastModified)
	const entryTagging =
		entriesToReview &&
		(await Promise.all(
			entriesToReview?.map(
				({ Key }) =>
					Key && getObjectTags(s3, Bucket, Key).then((r) => r?.TagSet)
			)
		))
	const filterPredicate = TAG_FILTER_PREDICATES[tagFilter]
	const filteredEntries = entriesToReview?.filter((_,i) => {
		const tags = entryTagging?.[i]
		// if no tags, then its not reviewed
		// presigned urls appear to lose the capacity to add tags on upload :/
		return (tagFilter === 'unreviewed' && tags && !tags.length) || (tags && tags.some(filterPredicate))
	})
	
	return filteredEntries
}


export async function getPresignedUrl(
	s3: S3Client,
	key: string,
	ContentType: string,
	prePath: string,
	operation: string
) {
	if (operation === 'putObject') {
		const ext: string = fileExtensionMap[ContentType]
		const fileName: string = `${key || nanoid()}${ext}`
		// Get signed URL from S3
		const s3Params: PutObjectCommandInput = {
			Bucket: config.S3_BUCKET!,
			Key: prePath + fileName,
			ContentType,
			// Tagging: "reviewed=false" // this does not work
		}
		const command = new PutObjectCommand(s3Params);
		const url = await getSignedUrl(s3, command, { expiresIn: URL_EXPIRATION_SECONDS });
		return {
			url,
			fileName,
			ContentType
		}
	} else if (operation === 'getObject') {
		const s3Params = {
			Bucket: config.S3_BUCKET,
			Key: prePath + key
		}
		const command = new GetObjectCommand(s3Params);
		const url = await getSignedUrl(s3, command, { expiresIn: URL_EXPIRATION_SECONDS });
		return {
			url,
			fileName: key,
			ContentType: null
		}
	} else {
		return {}
	}
}
export async function upload(
	s3: any,
	key: string,
	ContentType: string,
	body: any,
): Promise<PutObjectCommandOutput> {
	const command = new PutObjectCommand({
		Bucket: config.S3_BUCKET,
		ACL: 'private',
		Key: key,
		Body: body,
		ContentType: ContentType
	})
	const uploadResult = await s3.send(command)
	return uploadResult
}

export async function uploadMeta(
	s3: any,
	storyType: SubmissionType,
	key: string,
	hashedEmail: string
) {
	const now = new Date()
	const uploadTimestamp = now.toISOString()

	const uploadResult = await upload(
		s3,
		`meta/${hashedEmail}/${key}.json`,
		'application/json',
		JSON.stringify({
			storyType,
			uploadTimestamp
		})
	)

	return uploadResult
}

export async function putObject(s3: S3Client, Bucket: string, Key: string, body: any) {
	const command = new PutObjectCommand({
		Bucket,
		Key,
		Body: body
	});
	const response = await s3.send(command);
	return response
}

export async function deleteObject(s3: S3Client, Bucket: string, Key: string) {
	const command = new DeleteObjectCommand({
		Bucket,
		Key
	});
	const response = await s3.send(command);
	return response
}

export async function copyObject(s3: S3Client, region: string, accountId: string, bucket: string, originKey: string, destinationKey: string){
	const command = new CopyObjectCommand({
		Bucket: bucket,
		CopySource: encodeURI(`/${bucket}/${originKey}`),
		Key: destinationKey
	});
	const response = await s3.send(command);
	return response

}

export async function getSubmissionCounts(
	s3: any,
	Bucket: string,
	prefix: string
) {
	const currentFiles: ListObjectsCommandOutput | undefined = await getFileList(
		s3,
		Bucket,
		prefix
	)

	const baseCounts = {
		written: 0,
		av: 0,
		photo: 0
	}
	
	if (!currentFiles || !currentFiles.Contents) {
		return baseCounts
	}

	const fileNameList = currentFiles.Contents
		.map(entry => !!entry?.Key && entry.Key.split('/').pop()||'')
	const uniqueIds = fileNameList
		.map(entry => entry.split('.')[0].split('_meta')[0])
		.filter(onlyUnique)
	const counts = uniqueIds.map(id => {
		let type;
		const fileList = fileNameList.filter(f => f.includes(id))

		if (fileList.length === 3){ // photo -- meta, caption, and image
			type = 'photo'
		} 
		if (fileList.length === 2 && (fileList.includes(`${id}.webm`) || fileList.includes(`${id}.mp4`) || fileList.includes(`${id}.wav`))){ 
			// av + legacy formats and meta file
			type = 'av'
		}
		if (fileList.length === 2 && (fileList.includes(`${id}.md`))){ 
			type = 'written'
		}
		return {
			type
		}
	}).filter(entry => !!entry.type)
	
	const combinedCounts = counts.reduce(
		(acc, cur) => {
			switch (cur.type) {
				case 'written':
					acc.written++
					break
				case 'av':
					acc['av']++
					break
				case 'photo':
					acc.photo++
					break
				default:
					break
			}
			return acc
		},
		baseCounts
	)
	
	return combinedCounts
}
