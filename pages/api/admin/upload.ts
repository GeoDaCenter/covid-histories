//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getPresignedUrl, uploadMeta } from '../files/utils'
import hash from 'object-hash'
import { SubmissionType } from '../files/types'
// AWS
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })

const s3 = new AWS.S3({
	accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
	region: process.env.APP_AWS_REGION
})
const S3_BUCKET = process.env.APP_AWS_BUCKET || ''

interface QueryParams { 
    email: string,
    key: string,
    fileType: string,
    folder: string
}

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	const { query } = req
	// @ts-ignore
	const { email, key, fileType, folder }: QueryParams = query

	const session = getSession(req, res)
	const user = session?.user
	const isAdmin =
		user && user['https://stories.uscovidatlas.org/roles'].includes('Admin')

	if (isAdmin) {
		const hashedEmail = hash(email)
        const prePath = folder + '/' + hashedEmail + '/'
        console.log(prePath, key)
	console.log(fileType)
        const {
            url: uploadURL,
            fileName,
            ContentType
        } = await getPresignedUrl({
            Key: key,
            ContentType: fileType,
            prePath,
            operation: 'putObject'
        })
	console.log(uploadURL)
	console.log("fileName: " + fileName + "<end>")
	console.log(ContentType)
        res.status(200).json(
            JSON.stringify({
                uploadURL,
                fileName,
                ContentType
            })
        )
	} else {
		// Not Signed in
		res.status(401).json(
			JSON.stringify({
				error: 'Not authorized. Contact an admin'
			})
		)
	}
	res.end()
})
