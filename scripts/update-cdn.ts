import { ListObjectsCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { getFileList } from '../pages/api/files/utils'
import 'dotenv/config'

const S3_BUCKET = process.env.APP_AWS_BUCKET || ""
const REGION = process.env.APP_AWS_REGION || ""
const s3 = new S3Client({
	region: REGION,
    credentials:{
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
}})


async function main(){
    const uploadFileList = await getFileList(s3, S3_BUCKET, 'uploads/')
    const uploadContents = uploadFileList?.Contents?.filter(({Key}) => !!Key && !Key.includes('_meta.json'))
        .map(({Key, LastModified}) => ({Key, LastModified, id: Key && Key.split('/').slice(-1)[0].split('.')[0]}))
    const publicFileList = await getFileList(s3, S3_BUCKET, 'public/')
    console.log(uploadContents)
    return uploadContents
}

main().then(r => process.exit(0))