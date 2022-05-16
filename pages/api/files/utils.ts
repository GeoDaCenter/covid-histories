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

import { SubmissionType } from "./types";
import { nanoid } from "@reduxjs/toolkit";

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


const config = {
	REGION: process.env.APP_AWS_REGION,
	STAGE: 'dev',
	S3_BUCKET: process.env.APP_AWS_BUCKET
}


const URL_EXPIRATION_SECONDS = 60 * 5

export async function getPresignedUrl(
    s3: any,
	type: SubmissionType,
	key: string,
	fileType: string,
	prePath: string,
	operation: string
) {
	if (operation === 'putObject'){
		const ext: string =
			fileExtensionMap[fileType] || submissionTypeMap[type].fileExtension
		const fileName: string = `${key || nanoid()}${ext}`
		const ContentType = fileType ? fileType : submissionTypeMap[type].ContentType
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

export async function deleteObject(
	s3: any,
	Bucket: string,
	Key: string
){
	return s3
		.deleteObject({
			Bucket,
			Key
		})
		.promise()
}