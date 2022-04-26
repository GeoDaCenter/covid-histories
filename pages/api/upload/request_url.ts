//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { nanoid } from '@reduxjs/toolkit'

// AWS
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })

const URL_EXPIRATION_SECONDS = 60 * 5
const s3 = new AWS.S3()

const prePath = 'uploads/'

const config = {
	REGION: 'us-east-2',
	STAGE: 'dev',
	S3_BUCKET: 'atlas-histories'
}
const clientParams = {
	region: config.REGION
}

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	const { query } = req
	const { type, fileExtension, key } = query

	// @ts-ignore
	const { user } = getSession(req, res)
	if (user) {
		//@ts-ignore
		const { uploadURL, fileName, ContentType } = await getUploadURL(type, key, fileExtension)

		res.status(200).json(
			JSON.stringify({
				uploadURL,
				fileName,
				ContentType
			})
		)
	} else {
		// Not Signed in
		res.status(401)
	}
	res.end()
})

type SubmissionType = 'image' | 'video' | 'audio' | "photo"
const submissionTypeMap: {[key:string]: {fileExtension: string, ContentType: string}} = {
    "audio": {
        "fileExtension":".wav",
        "ContentType":"audio/wav"
    },
    "video": {
        "fileExtension":".mp4",
        "ContentType":"video/mp4"
    },
    "written": {
        "fileExtension": ".md",
        "ContentType": "text/markdown; charset=UTF-8"
    },
    "photo": {
        "fileExtension": ".jpg",
        "ContentType": "image/" // jpg, jpeg, png, tif, tiff, gif, bmp
    }
}
const imageExtensionMap: {[key:string]: string} = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".gif": "image/gif",
    ".bmp": "image/bmp"
}

async function getUploadURL(type: SubmissionType, key: string, fileExtension: string) {	
    const ext: string = fileExtension || submissionTypeMap[type].fileExtension
	const fileName: string = `${key || nanoid()}${ext}`
    const ContentType = type === "photo" ? imageExtensionMap[ext] : submissionTypeMap[type].ContentType 

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
