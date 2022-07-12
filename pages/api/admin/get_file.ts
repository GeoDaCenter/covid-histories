//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getFileList } from '../files/utils'
import hash from 'object-hash'
import { getPresignedUrl } from '../files/utils'
// AWS
import { ListObjectsCommandOutput, S3Client } from '@aws-sdk/client-s3'

const S3_BUCKET = process.env.APP_AWS_BUCKET || ''
const REGION = process.env.APP_AWS_REGION || ''
const s3 = new S3Client({
	region: REGION,
	credentials: {
		accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!
	}
})

interface PresignedGetOutput {
	fileType: string;
	url: string;
	fileName: string;
	ContentType: string | null
}

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	// @ts-ignore
	const { user } = getSession(req, res)
	const isAdmin =
		user && user['https://stories.uscovidatlas.org/roles'].includes('Admin')
	const { fileId, folder } = req.query
	if (isAdmin) {
		const prefix = `${folder || 'uploads'}/${fileId}`
		const currentFiles: ListObjectsCommandOutput | undefined =
			await getFileList(prefix)
		const fileNames = currentFiles?.Contents?.map(({ Key, LastModified }) => ({
			Key,
			LastModified
		}))
		
		const presignedGets = await Promise.all(
			fileNames?.map(({ Key, LastModified }) =>
				getPresignedUrl({
					Key: Key as string,
					operation: 'getObject'
				})
			) || []
		)

		const metaGet = presignedGets.find((file) => file.url.includes('meta.json'))
		const metaData = metaGet?.url ? await fetch(metaGet.url).then((res) => res.json()) : {}
		const contentGets = presignedGets
			.filter((file) => !file.url.includes('meta.json'))
			.map((f) => ({ ...f, fileType: f.fileName?.split('.').slice(-1)[0] }))
			
		let content = {
			content: {},
			additionalContent: {}
		} as {
			content: PresignedGetOutput | undefined
			additionalContent: PresignedGetOutput | undefined
		}
		if (contentGets.length > 0) {
			if (contentGets.length === 1) {
				content.content = contentGets[0]
			} else {
				const mdContent = contentGets.find((file) => file.fileName.includes('.md'))
				const mainContent = contentGets.find((file) => !file.fileName.includes('.md'))
				content.content = mainContent
				content.additionalContent = mdContent
			}
		}
		
		const mergedData = {
			...metaData,
			...content
		}

		if (folder === 'previewGifs') {
			res.status(200).json(JSON.stringify(presignedGets[0]))
		} else {
			res.status(200).json(JSON.stringify(mergedData))
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
