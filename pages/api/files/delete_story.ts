//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { deleteObject, getFileList } from './utils'
import hash from 'object-hash'
import { FileListReturn } from './types'
import { ListObjectsCommandOutput, S3Client } from "@aws-sdk/client-s3";
// AWS
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })

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
    const storyId = req.body;

	if (user && storyId) {
		const encrypted = hash(user.email)
		const prefix = `uploads/${encrypted}/${storyId}`
		const currentFiles: ListObjectsCommandOutput | undefined = await getFileList(s3, S3_BUCKET, prefix)
        if (currentFiles?.Contents?.length){
            const files = [
                ...currentFiles.Contents,
                // previously, we deleted meta files, but we'll keep these to log uploads
                // {Key: `meta/${encrypted}/${storyId}.json`},
                // {Key: `meta/${encrypted}/${storyId}_meta.json`}
            ]

            const deletionResults = await Promise.all(files.map(({Key}) => deleteObject(s3, S3_BUCKET, Key||'')))
            
            if (deletionResults?.length > 0) {
                res.status(200).json(
                    JSON.stringify({message: `Successfully deleted files for ${storyId}. ${deletionResults.length} files deleted.`})
                )
            } else {
                res.status(500).json(
                    JSON.stringify({message: `Error deleting files for ${storyId}. Please contact uscovidatlas@gmail.com`})
                )
            }
        } else {            
            res.status(500).json(
                JSON.stringify({
                    error: `No files to delete for story id ${storyId}`
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
