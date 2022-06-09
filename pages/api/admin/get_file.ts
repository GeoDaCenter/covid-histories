//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getFileList } from '../files/utils'
import hash from 'object-hash'
import {getPresignedUrl} from '../files/utils'
// AWS
import { ListObjectsCommandOutput, S3Client } from "@aws-sdk/client-s3";

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
	// @ts-ignore
	const { user } = getSession(req, res)
	const isAdmin =
		user && user['https://stories.uscovidatlas.org/roles'].includes('Admin')
    const { fileId } = req.query
	if (isAdmin) {
		const prefix = `uploads/${fileId}`
		const currentFiles: ListObjectsCommandOutput | undefined = await getFileList(s3, S3_BUCKET, prefix)
		const fileNames = currentFiles?.Contents?.map(({Key, LastModified}) => ({Key, LastModified}))
		const presignedGets = await Promise.all(
			fileNames?.map(({Key, LastModified}) => 
				getPresignedUrl(s3, Key||'', '', '', 'getObject')
			)||[])	
		const metaData = await Promise.all(
			presignedGets
				.filter(f => f.fileName?.includes('_meta.json'))
				.map(f => !!f.url && fetch(f.url).then(r => r.json()))
		)
		const mergedData = metaData
			.map((meta) => (
				{...meta, 
					content: presignedGets
						.filter(f => f.fileName?.includes(meta.storyId) && !f.fileName?.includes('_meta.json'))
						.map(f => ({...f, fileType: f.fileName?.split('.').slice(-1)[0]}))
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
