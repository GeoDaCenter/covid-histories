import { FileListReturn } from './types'
import hash from 'object-hash'
import {s3,config} from './_s3'

export const getFileList = async (
	Prefix: string
): Promise<FileListReturn | undefined> => {
	try {
		const objects = await s3
			.listObjects({
				Bucket:config.S3_BUCKET,
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

const submissionTypeMap: {
	[key: string]: { fileExtension: string; ContentType: string }
} = {
	audio: {
		fileExtension: '.wav',
		ContentType: 'audio/wav'
	},
	video: {
		fileExtension: '.mp4',
		ContentType: 'video/mp4'
	},
	written: {
		fileExtension: '.md',
		ContentType: 'text/markdown; charset=UTF-8'
	},
	photo: {
		fileExtension: '.jpg',
		ContentType: 'image/' // jpg, jpeg, png, tif, tiff, gif, bmp
	},
	meta: {
		fileExtension: '.json',
		ContentType: 'text/markdown; charset=UTF-8'
	}
}

const fileExtensionMap: { [fileType: string]: string } = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/tiff': '.tiff',
	'image/gif': '.gif',
	'image/bmp': '.bmp'
}

const URL_EXPIRATION_SECONDS = 60 * 5



export async function listFiles(userId:string){
		const encrypted = hash(userId)
		const prefix = `uploads/${encrypted}`
		const currentFiles: FileListReturn | undefined = await getFileList(prefix)
		const fileNames = currentFiles ? currentFiles?.Contents?.map(({Key, LastModified}) => ({Key: Key.split('/').slice(-1)[0], LastModified})) : []
		const numberOfSubmissions = fileNames?.filter(f => f.Key?.includes('_meta.json')).length
    return {numberOfSubmissions,fileNames}
}

export async function deleteStory(userId:string,storyId:string){

		const encrypted = hash(userId)
		const prefix = `uploads/${encrypted}/${storyId}`
		const currentFiles: FileListReturn | undefined = await getFileList(prefix)
        if (currentFiles?.Contents.length){
            const files = [
                ...currentFiles.Contents,
                {Key: `meta/${encrypted}/${storyId}.json`},
                {Key: `meta/${encrypted}/${storyId}_meta.json`}
            ]
            const deletionResults = await Promise.all(files.map(({Key}) => deleteObject(Key)))
            const newFileList: FileListReturn | undefined = await getFileList(prefix)
            if (newFileList?.Contents.length === 0) {
                return {result:"AllDeleted", filesDeleted: deletionResults.length}
            } else {
                return {result:"FailedToDelete", filesRemaining: newFileList?.Contents.length}
            }
        } else {            
          return {result:"NoFilesToDelete"}
        }
}

export async function getPresignedUrl(
	type: SubmissionType,
	key: string,
	fileType: string,
	prePath: string,
	operation: string
) {
	if (operation === 'putObject') {
		const ext: string =
			fileExtensionMap[fileType] || submissionTypeMap[type].fileExtension
		const fileName: string = `${key || nanoid()}${ext}`
		const ContentType = fileType
			? fileType
			: submissionTypeMap[type].ContentType
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
	type: SubmissionType,
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
				type,
				uploadTimestamp
			}),
			ContentType: 'application/json'
		})
		.promise()

	return uploadResult
}

export async function deleteObject( Key: string) {
	return s3
		.deleteObject({
			Bucket: config.S3_BUCKET,
			Key
		})
		.promise()
}

export async function getSubmissionCounts(
	prefix: string
) {
	const currentFiles: FileListReturn | undefined = await getFileList(
		prefix
	)
	const fileNames = currentFiles
		? currentFiles?.Contents?.map(({ Key, LastModified }) => ({
				Key: Key.split('/').slice(-1)[0],
				LastModified
		  }))
		: []
	const filteredSubmissions = fileNames?.filter(
		(f) => !f.Key?.includes('_meta.json') && !f.Key.includes('survey.json')
	)
	const metaResponse = await Promise.all(
		filteredSubmissions?.map((f) =>
			s3.getObject({ Bucket:config.S3_BUCKET, Key: `${prefix}/${f.Key}` }).promise()
		)
	)
	const allMeta = metaResponse.map((r) => JSON.parse(r.Body.toString()))
	const metaCounts = allMeta.reduce(
		(acc, cur) => {
			switch (cur.type) {
				case 'written':
					acc.written++
					break
				case 'audio':
					acc['audio']++
					break
				case 'video':
					acc['video']++
					break
				case 'photo':
					acc.photo++
					break
				default:
					break
			}
			return acc
		},
		{
			written: 0,
			video: 0,
			audio: 0,
			photo: 0
		}
	)
	return metaCounts
}
