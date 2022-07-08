//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getFileList } from './utils'
import hash from 'object-hash'
import { FileListReturn } from './types'
import { getPresignedUrl } from './utils'
import { ListObjectsCommandOutput } from '@aws-sdk/client-s3'

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  // @ts-ignore
  const { user } = getSession(req, res)
  if (user) {
    const encrypted = hash(user.email)
    const prefix = `uploads/${encrypted}`
    const currentFiles: ListObjectsCommandOutput | undefined =
      await getFileList(prefix)
    const fileNames =
      currentFiles?.Contents &&
      currentFiles?.Contents.map(({ Key, LastModified }) => ({
        Key: Key && Key.split('/').slice(-1)[0],
        LastModified
      }))

    const presignedGets = await Promise.all(
      fileNames?.map(({ Key, LastModified }) =>
        getPresignedUrl({
          Key: Key as string,
          operation: 'getObject',
          prePath: `uploads/${encrypted}/`
        })
      ) || []
    )

    const metaData = await Promise.all(
      presignedGets
        .filter((f) => f.fileName?.includes('_meta.json'))
        .map((f) => !!f.url && fetch(f.url).then((r) => r.json()))
    )
    const mergedData = metaData.map((meta) => ({
      ...meta,
      content: presignedGets
        .filter(
          (f) =>
            f.fileName?.includes(meta.storyId) &&
            !f.fileName?.includes('_meta.json')
        )
        .map((f) => ({ ...f, fileType: f.fileName?.split('.').slice(-1)[0] }))
    }))

    res.status(200).json(JSON.stringify(mergedData))
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
