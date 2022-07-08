import { S3Client } from '@aws-sdk/client-s3'

export const config = {
  REGION: process.env.APP_AWS_REGION,
  STAGE: 'dev',
  S3_BUCKET: process.env.APP_AWS_BUCKET
}

export const s3 = new S3Client({
  region: config.REGION,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!
  }
})
