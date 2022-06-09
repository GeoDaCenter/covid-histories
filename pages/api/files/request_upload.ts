//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getPresignedUrl, getSubmissionCounts, uploadMeta } from './utils'
import { QueryParams, SubmissionType } from './types'
import hash from 'object-hash'
// AWS
import { S3Client } from "@aws-sdk/client-s3";

const S3_BUCKET = process.env.APP_AWS_BUCKET || ""
const REGION = process.env.APP_AWS_REGION || ""
const s3 = new S3Client({
	region: REGION,
    credentials:{
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
}})

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	const { query } = req
	// @ts-ignore
	const {
		storyType: _storyType,
		fileType: _fileType,
		storyId: _storyId
	}: QueryParams = query
	const key = decodeURI(_storyId)
	const storyType = decodeURI(_storyType) as SubmissionType
	const fileType = decodeURI(_fileType)
	const session = getSession(req, res)
	const user = session?.user
	if (
		!storyType ||
		!['audio', 'video', 'written', 'photo'].includes(storyType)
	) {
		res.status(401).json(
			JSON.stringify({
				error: 'Invalid story type.'
			})
		)
	}
	if (user) {
		const hashedEmail = hash(user.email)
		const prefix = `uploads/${hashedEmail}`
		const metaCounts = await getSubmissionCounts(s3, S3_BUCKET, prefix)
		// @ts-ignore
		const cleanedStoryType: 'av' | 'written' | 'photo' = {
			audio: 'av',
			video: 'av',
			written: 'written',
			photo: 'photo'
		}[storyType]

		const canUpload =
			(['video', 'audio'].includes(storyType) &&
				metaCounts[cleanedStoryType] < 6) ||
			(!['video', 'audio'].includes(storyType) &&
				metaCounts[cleanedStoryType] < 3)

		if (canUpload) {
			const prePath = 'uploads/' + hashedEmail + '/'
			const {
				url: uploadURL,
				fileName,
				ContentType
			} = await getPresignedUrl(s3, key, fileType, prePath, 'putObject')
			const metaResult = await uploadMeta(s3, storyType, key, hashedEmail)
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
			res.status(400).json(
				JSON.stringify({
					error:
						'You have reached the maximum number of submissions for this story type.'
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
