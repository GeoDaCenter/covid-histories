//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { setObjectTagging, getFileList, deleteObject } from '../files/utils'
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

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	// @ts-ignore
	const { user } = getSession(req, res)
    const action = req.query.action // approve, reject, delete
    const fileId= Array.isArray(req.query.fileId) ? req.query.fileId[0] : req.query.fileId // approve, reject
	const isAdmin = user && user['https://stories.uscovidatlas.org/roles'].includes('Admin')

	if (isAdmin) {
		const currentFiles: ListObjectsCommandOutput | undefined = await getFileList(s3, S3_BUCKET, `uploads/${fileId}`)
        
        if(currentFiles?.Contents && currentFiles?.Contents?.length > 0) {
            const files = currentFiles.Contents.map(file => file.Key || 'PLACEHOLDER_MISSING_KEY')
            switch(action){
                case 'approve':
                    const approveResponse = await Promise.all(
                        files.map(file => 
                            setObjectTagging(
                                s3, 
                                S3_BUCKET, 
                                file, 
                                [
                                    {Key: 'approved', Value: 'true'},
                                    {Key: 'reviewed', Value: 'true'},
                                    {Key: 'reviewed_by', Value: user.name},
                                ]
                            )
                        )
                    )
                    res.status(200).json(
                        JSON.stringify({
                            files: approveResponse
                        })
                    )
                    break
                case 'reject':
                    const rejectResponse = await Promise.all(
                        files.map(file => 
                            setObjectTagging(
                                s3, 
                                S3_BUCKET, 
                                file, 
                                [
                                    {Key: 'approved', Value: 'true'},
                                    {Key: 'reviewed', Value: 'true'},
                                    {Key: 'reviewed_by', Value: user.name},
                                ]
                            )
                        )
                    )
                    res.status(200).json(
                        JSON.stringify({
                            files: rejectResponse
                        })
                    )
                    break
                case 'delete':
                    const deleteResponse = await Promise.all(
                        files.map(file => 
                            deleteObject(s3, S3_BUCKET, file)
                        )
                    )
                    res.status(200).json(
                        JSON.stringify({
                            files: deleteResponse
                        })
                    )
                    break
                default:
                    res.status(400).json(
                        JSON.stringify({
                            error: 'Invalid action'
                        })
                    )
                    break
		
            }
        } else {
            res.status(500).json(
                JSON.stringify({
                    error: 'Could not find files'
                })
            )
        }
	} else {
		// Not Signed in
		res.status(401).json(
			JSON.stringify({
				error: 'Not signed in as admin'
			})
		)
	}
	res.end()
})
