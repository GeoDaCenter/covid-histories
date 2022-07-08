import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	ListObjectsCommand
} from '@aws-sdk/client-s3'
import { UserCallRecord } from './_types'
import hash from 'object-hash'
import {listFiles, uploadMeta} from '../files/utils'
import {s3,config} from '../files/_s3'
import { nanoid } from '@reduxjs/toolkit'
import fs from 'fs';
import os from 'os';
import path from 'path';
import url from 'url'
import http from 'http'

export const hashPhoneNo = (number: string) => {
	return hash(number)
}

export const getUserRecord= async(
  phoneNo:string
)=>{
	const hashedNumber = hashPhoneNo(phoneNo)
  try{
    const result = await s3.getObject({
          Bucket: config.S3_BUCKET,
          Key: `/meta/${hashedNumber}/call.json`,
    }).promise();
    return JSON.parse(result.Body.toString()) 
  }
  catch(err){
    console.log("error getting user ", err)
    return null 
  }
}

export const getPreviousCalls = async(
  phoneNo: string
)=>{
  let files = await listFiles(phoneNo);
  return files
}

const downloadFile = async(tmpDir:string, audioUrl:string) : Promise<string>=>{
  return new Promise((resolve,reject)=>{
    const parsed  = url.parse(audioUrl)
    const fileName = path.basename(parsed.pathname!)
    const destinationFile = path.join(tmpDir,fileName)
    const file = fs.createWriteStream(destinationFile);
    http.get(audioUrl, (response)=> {

     response.pipe(file);

     file.on("finish", () => {
         file.close();
         resolve(destinationFile)
     });
  })
});
}

export const copyAudioFromTwillioToS3 = async(hashedPhone:string, storyId:string, audioUrl:string) =>{
  let tmpDir
  try{
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'covid_calls'));
    let file = await downloadFile(tmpDir, audioUrl) 
    await s3.upload({
        Bucket: config.S3_BUCKET,
        ACL: 'private',
        Key: `uploads/${hashedPhone}/${storyId}.wav`,
        Body:  fs.readFileSync(file),
        ContentType: 'audio/wav'
      })
  }
  finally{
    if(tmpDir){
      fs.rmSync(tmpDir,{recursive: true})
    }
  }
}

export const getExistingStories = async(phoneNo:string)=>{
  const {fileNames} = await listFiles(phoneNo)
  return Promise.all(fileNames.filter(f => f.Key?.includes('_meta.json'))
           .map(f => s3.send(new GetObjectCommand({
              Bucket: config.S3_BUCKET,
              Key: f.Key!
           }))))
}

export const saveCallStory = async(phoneNo: string, topicId: string, audioUrl: string)=> { 
  const storyId = nanoid()
  const hashedPhone = hash(phoneNo)

  await copyAudioFromTwillioToS3( hashedPhone, storyId, audioUrl)

	await s3.upload({
			Bucket: config.S3_BUCKET,
			ACL: 'private',
			Key: `meta/${hashedPhone}/${storyId}_meta.json`,
			Body: JSON.stringify({
				type:'audio',
        topicId,
        uploadTimestamp: (new Date()).toISOString()
			}),
			ContentType: 'application/json'
		})

}

export const createOrUpdateUserRecord = async (
	phoneNo: string,
	user?: UserCallRecord,
  update?: Partial<UserCallRecord>
) => {
	const hashedNumber = hashPhoneNo(phoneNo)

	const initial_data: UserCallRecord = {
		numberHash: hashedNumber,
		createdAt: new Date(),
    language: 'en',
    permission : false
	}
  const base =  user ? user : initial_data
  console.log("Updating hash", hashedNumber)
  console.log("Update is ", {...base,...update})

	try {
		const result = await  s3.upload({
				Bucket: config.S3_BUCKET,
				Key: `/meta/${hashedNumber}/call.json`,
				Body: JSON.stringify({...base, ...update}),
				ACL: 'private',
        ContentType:'application/json'
    }).promise()

    console.log("UPLOAD RESULT ",result)
		return user ? user : initial_data
	} catch (err) {
		console.log('Failed to create initial user ', phoneNo, err)
		throw err
	}
}



