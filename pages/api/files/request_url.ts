//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getPresignedUrl, getSubmissionCounts, uploadMeta } from './utils'
import {QueryParams} from './types'
import hash from 'object-hash'
// AWS
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })

const s3 = new AWS.S3({
	accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
	region: process.env.APP_AWS_REGION
})
const S3_BUCKET = process.env.APP_AWS_BUCKET || ""

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	const { query } = req
	// @ts-ignore
	const { storyType, type, fileType, key }: QueryParams = query
	
	const session = getSession(req, res)
	const user = session?.user

	if (user) {	
		const hashedEmail = hash(user.email)
		const prefix = `meta/${hashedEmail}`
        const metaCounts = await getSubmissionCounts(s3, S3_BUCKET, prefix)
		console.log(metaCounts[storyType])
		if (metaCounts[storyType] !== undefined && metaCounts[storyType] < 3) {
			const prePath = 'uploads/' + hashedEmail + '/'
			const { url: uploadURL, fileName, ContentType } = await getPresignedUrl(
				s3,
				type,
				key,
				fileType,
				prePath,
				'putObject'
			)
			const metaResult = await uploadMeta(s3, type, key, hashedEmail)
			if (!metaResult || !uploadURL) {
				console.log(metaResult, uploadURL)
				res.status(500).json(
					JSON.stringify({
						error: 'The server failed to upload, please try again.'
					})
				)
			} else {
				res.status(200).json(
					JSON.stringify({
						uploadURL,
						fileName,
						ContentType
					})
				)
			}
		} else {
			res.status(400).json(
				JSON.stringify({
					error: 'You have reached the maximum number of submissions for this story type.'
				})
			)
		}
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