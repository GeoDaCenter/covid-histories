import { FileListReturn } from './types'

export const getFileList = async (
	s3: any,
	Bucket: string,
	Prefix: string
): Promise<FileListReturn | undefined> => {
	try {
		const objects = await s3
			.listObjects({
				Bucket,
				Prefix
			})
			.promise()
		return objects
	} catch (err) {
		console.log('Error', err)
	}
}

import { SubmissionType } from './types'
import { nanoid } from '@reduxjs/toolkit'

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

const config = {
	REGION: process.env.APP_AWS_REGION,
	STAGE: 'dev',
	S3_BUCKET: process.env.APP_AWS_BUCKET
}

const URL_EXPIRATION_SECONDS = 60 * 5

export async function getPresignedUrl(
	s3: any,
	key: string,
	ContentType: string,
	prePath: string,
	operation: string
) {
	if (operation === 'putObject') {
		const ext: string = fileExtensionMap[ContentType]
		const fileName: string = `${key || nanoid()}${ext}`
		// Get signed URL from S3
		const s3Params = {
			Bucket: config.S3_BUCKET,
			Key: prePath + fileName,
			Expires: URL_EXPIRATION_SECONDS,
			ContentType
			// ACL: 'public-read'
		}
		const url = await s3.getSignedUrlPromise(operation, s3Params)
		return {
			url,
			fileName,
			ContentType
		}
	} else if (operation === 'getObject') {
		const s3Params = {
			Bucket: config.S3_BUCKET,
			Key: prePath + key,
			Expires: URL_EXPIRATION_SECONDS
			// ACL: 'public-read'
		}
		const url = await s3.getSignedUrlPromise(operation, s3Params)

		return {
			url,
			fileName: key,
			ContentType: null
		}
	} else {
		return {}
	}
}

export async function uploadMeta(
	s3: any,
	storyType: SubmissionType,
	key: string,
	hashedEmail: string
) {
	const now = new Date()
	const uploadTimestamp = now.toISOString()
	const uploadResult = await s3
		.upload({
			Bucket: config.S3_BUCKET,
			ACL: 'private',
			Key: `meta/${hashedEmail}/${key}.json`,
			Body: JSON.stringify({
				storyType,
				uploadTimestamp
			}),
			ContentType: 'application/json'
		})
		.promise()

	return uploadResult
}

export async function deleteObject(s3: any, Bucket: string, Key: string) {
	return s3
		.deleteObject({
			Bucket,
			Key
		})
		.promise()
}

const baseCounts = {
	written: 0,
	av: 0,
	photo: 0
}

export const onlyUnique = (value: string, index: number, self: string[]) => self.indexOf(value) === index

export async function getSubmissionCounts(
	s3: any,
	Bucket: string,
	prefix: string
) {
	const currentFiles: FileListReturn | undefined = await getFileList(
		s3,
		Bucket,
		prefix
	)
	
	if (!currentFiles || !currentFiles.Contents) {
		return baseCounts
	}

	const fileNameList = currentFiles.Contents
		.map(entry => entry.Key.split('/').pop()||'')
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
