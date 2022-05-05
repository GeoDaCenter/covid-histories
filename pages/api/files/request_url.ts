//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getPresignedUrl, uploadMeta } from './utils'
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

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	const { query } = req
	// @ts-ignore
	const { type, fileType, key }: QueryParams = query

	const session = getSession(req, res)
	const user = session?.user

	if (user) {
		const hashedEmail = hash(user.email)
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
		// Not Signed in
		res.status(401).json(
			JSON.stringify({
				error: 'Not Signed In'
			})
		)
	}
	res.end()
})