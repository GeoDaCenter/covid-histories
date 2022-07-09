//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import {
  getFileList,
  getObjectTags,
  getTaggedFileList,
  TagFilter
} from '../files/utils'
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
  const filter: TagFilter = (req.query.filter as TagFilter) || 'all'
  const isAdmin =
    user && user['https://stories.uscovidatlas.org/roles'].includes('Admin')
  if (isAdmin) {
    const unreviewedEntries = await getTaggedFileList(filter)

    res.status(200).json(JSON.stringify(unreviewedEntries))
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
