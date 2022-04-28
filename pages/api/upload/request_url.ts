//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { nanoid } from '@reduxjs/toolkit'

// AWS
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })

const URL_EXPIRATION_SECONDS = 60 * 5
const s3 = new AWS.S3({
	accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
	region: process.env.APP_AWS_REGION
})

const prePath = 'uploads/'

const config = {
	REGION: process.env.APP_AWS_REGION,
	STAGE: 'dev',
	S3_BUCKET: process.env.APP_AWS_BUCKET
}

const clientParams = {
	region: config.REGION
}

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	const { query } = req
	const { type, fileType, key } = query

	// @ts-ignore
	const { user } = getSession(req, res)
	if (user) {
		//@ts-ignore
		const { uploadURL, fileName, ContentType } = await getUploadURL(
			// @ts-ignore
			type,
			key,
			fileType
		)

		res.status(200).json(
			JSON.stringify({
				uploadURL,
				fileName,
				ContentType
			})
		)
	} else {
		// Not Signed in
		res.status(401).json(
			JSON.stringify({
				error: 'Not Signed In'
			})
		)
	}
	res.end()
})

type SubmissionType = 'audio' | 'video' | 'written' | 'photo'
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
	}
}
const fileExtensionMap: { [fileType: string]: string } = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/tiff': '.tiff',
	'image/gif': '.gif',
	'image/bmp': '.bmp'
}

async function getUploadURL(
	type: SubmissionType,
	key: string,
	fileType: string
) {
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
	const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)

	return {
		uploadURL,
		fileName,
		ContentType
	}
}
