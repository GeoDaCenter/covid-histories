import { ListObjectsCommandOutput, S3Client } from '@aws-sdk/client-s3'
import {
  CloudFrontClient,
  CreateInvalidationCommand,
  CreateInvalidationCommandInput
} from '@aws-sdk/client-cloudfront' // ES Modules import
import {
  getFileList,
  getObjectTags,
  deleteObject,
  copyObject,
  getPresignedUrl,
  putObject
} from '../pages/api/files/utils'
import fetch from 'node-fetch'
import 'dotenv/config'

const S3_BUCKET = process.env.APP_AWS_BUCKET!
const REGION = process.env.APP_AWS_REGION!
const ACCOUNT_ID = process.env.APP_AWS_ACCOUNT_ID!
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!
  }
})

const cloudfront = new CloudFrontClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!
  }
})

interface FileObject {
  Key: string | undefined
  id: string | undefined
  LastModified: Date | undefined
}

interface DistributionMeta {
  id: string
  fileName: string
  storyType: string
  centroid: number[]
  theme: string
  tags: string[]
  fileType: string
}

export interface PublicSubmission {
  type: string
  theme: string
  county: string
  id: string
  centroid: number[]
  title: string
  tags: string[]
}

async function main() {
  // get the full file list
  // from uploads (raw)
  // and public folders
  const uploadFileList = await getFileList('uploads/')
  const publicFileList = await getFileList('public/')

  // clean to essential data needed
  const uploadContents: FileObject[] | undefined =
    uploadFileList?.Contents?.filter(
      ({ Key }) => !!Key && !Key.includes('_meta.json')
    ).map(({ Key, LastModified }) => ({
      Key: Key || '',
      LastModified,
      id: Key && Key.split('/').slice(-1)[0].split('.')[0]
    }))
  const publicContents: FileObject[] | undefined =
    publicFileList?.Contents?.filter(
      ({ Key }) => !!Key && !Key.includes('index.json')
    ).map(({ Key, LastModified }) => ({
      Key: Key || '',
      LastModified,
      id: Key && Key.split('/').slice(-1)[0].split('.')[0]
    }))
  let publicFiles: { id: string; Key: string; fileType: string }[] = []
  // early return if no bueno
  if (uploadContents === undefined || publicContents === undefined) {
    console.log('Error: Could not get file list')
    return
  }
  // get all object tagging for uploads
  // these govern and record the approval state
  const uploadTags = await Promise.all(
    uploadContents.map(({ Key }) => getObjectTags(Key!))
  )

  // loop through all files
  // if already public and approved, great!
  // if approved but not public, copy to public
  // if public, but approved recinded or not approved, delete from public
  for (let i = 0; i < uploadContents.length; i++) {
    const { Key, id } = uploadContents[i]
    const fileType = '.' + Key?.split('.').slice(-1)[0]
    const { TagSet } = uploadTags[i] || {}
    const publicFile = publicContents.find(
      ({ id: publicId }) => publicId === id
    )
    const approvalStatus = TagSet?.find((f) => f.Key === 'approved')?.Value

    if (approvalStatus === 'true')
      publicFiles.push({ id: id!, Key: Key!, fileType: fileType! })

    if (approvalStatus === 'true' && publicFile !== undefined) {
      continue
    } else if (approvalStatus === 'true' && publicFile === undefined) {
      const _response = await copyObject(Key!, `public/${id}.${fileType}`)
    } else if (approvalStatus === 'false' && publicFile !== undefined) {
      const _response = await deleteObject(publicFile.Key!)
    }
  }

  // loop through public files
  // if missing from uplodas, this means they were delete
  // if so, delete
  for (let i = 0; i < publicContents.length; i++) {
    const { Key, id } = publicContents[i]
    const uploadFile = uploadContents.find(
      ({ id: uploadId }) => uploadId === id
    )

    if (uploadFile === undefined) {
      const _response = await deleteObject(Key!)
    }
  }

  // build index file
  const existingMeta: PublicSubmission[] = await getPresignedUrl({
    Key: 'public/index.json',
    operation: 'getObject'
  })
    .then((response) => {
      if (response && response?.url) {
        return fetch(response.url)
      } else {
        return null
      }
    })
    .then((data) => data && data?.json())
    .catch(() => [])

  const fileIndexPromises: Promise<PublicSubmission>[] = publicFiles.map(
    async ({ id, Key, fileType }) => {
      const existingEntry: PublicSubmission | undefined = existingMeta?.find(
        ({ id: existingId }) => existingId === id
      )
      if (existingEntry !== undefined) {
        return existingEntry
      } else {
        return getPresignedUrl({
          Key: `${Key.split(fileType)[0]}_meta.json`,
          operation: 'getObject'
        })
          .then((fileMetaUrl) => {
            if (fileMetaUrl && fileMetaUrl?.url) {
              return fetch(fileMetaUrl.url).then((data) => {
                if (data && data?.json) {
                  return data.json()
                }
                return null
              })
            } else {
              throw new Error('Error: Could not get file meta')
            }
          })
          .then(({ title, county, storyType, theme, tags }) => {
            return {
              id,
              title,
              county: county?.label,
              centroid: county?.centroid,
              theme,
              tags: tags || [],
              type: storyType,
              fileType
            }
          })
          .catch(() => {
            return {
              id: '',
              title: '',
              county: '',
              centroid: [0, 0],
              theme: '',
              tags: [],
              type: '',
              fileType: ''
            }
          })
      }
    }
  )
  const fileMeta: PublicSubmission[] = await Promise.all(
    fileIndexPromises
  ).then((results) => results.filter(({ id }) => id.length))
  const _fileMetaResponse = await putObject(
    'public/index.json',
    JSON.stringify(fileMeta)
  )

  // invalidate cache
  const invalidationParams: CreateInvalidationCommandInput = {
    DistributionId: process.env.APP_AWS_CLOUDFRONT_DISTRIBUTION_ID!,
    InvalidationBatch: {
      CallerReference: `${Date.now()}`,
      Paths: {
        Quantity: 1,
        Items: ['/*']
      }
    }
  }

  const invalidationCommand = new CreateInvalidationCommand(invalidationParams)
  const _invalidationResponse = await cloudfront.send(invalidationCommand)

  return uploadContents
}

main().then((r) => process.exit(0))
