//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getFileList } from './utils'
import hash from 'object-hash'
import { FileListReturn } from './types'
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
	if (user) {			
		const encrypted = hash(user.email)
		const prefix = `uploads/${encrypted}`
		const currentFiles: ListObjectsCommandOutput | undefined = await getFileList(s3, S3_BUCKET, prefix)
		const fileNames = currentFiles ? currentFiles?.Contents?.map(({Key, LastModified}) => ({Key: Key && Key.split('/').slice(-1)[0], LastModified})) : []
		const numberOfSubmissions = fileNames?.filter(f => f.Key?.includes('_meta.json')).length

		res.status(200).json(
			JSON.stringify({
				numberOfSubmissions,
                fileNames
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
