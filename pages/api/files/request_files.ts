//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getFileList } from './utils'
import hash from 'object-hash'
import { FileListReturn } from './types'
import {getPresignedUrl} from './utils'
// AWS
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })

const S3_BUCKET = process.env.APP_AWS_BUCKET || ""
const REGION = process.env.APP_AWS_REGION || ""
const s3 = new AWS.S3({
	accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
	region: REGION
})

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	// @ts-ignore
	const { user } = getSession(req, res)
	if (user) {			
		const encrypted = hash(user.email)
		const prefix = `uploads/${encrypted}`
		const currentFiles: FileListReturn | undefined = await getFileList(s3, S3_BUCKET, prefix)
		const fileNames = currentFiles?.Contents.map(({Key, LastModified}) => ({Key: Key.split('/').at(-1), LastModified}))
		
		const presignedGets = await Promise.all(
			fileNames?.map(({Key, LastModified}) => 
				getPresignedUrl(s3, '', Key||'', '', `uploads/${encrypted}/`, 'getObject')
			)||[])	
				
		const metaData = await Promise.all(
			presignedGets
				.filter(f => f.fileName?.includes('_meta.json'))
				.map(f => fetch(f.url).then(r => r.json()))
		)
		const mergedData = metaData
			.map((meta) => (
				{...meta, 
					content: presignedGets
						.filter(f => f.fileName?.includes(meta.storyId) && !f.fileName?.includes('_meta.json'))
						.map(f => ({...f, fileType: f.fileName?.split('.').at(-1)}))
				}
			))
		

		res.status(200).json(
			JSON.stringify(mergedData)
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
