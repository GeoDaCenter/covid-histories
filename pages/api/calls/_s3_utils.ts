import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	ListObjectsCommand,
  GetObjectCommandOutput,
  DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { UserCallRecord } from './_types'
import hash from 'object-hash'
import { listFiles } from '../files/utils'
import { s3, config } from '../files/_s3'
import { nanoid } from '@reduxjs/toolkit'
import fs from 'fs'
import os from 'os'
import path from 'path'
import url from 'url'
import fetch from 'node-fetch'

export const hashPhoneNo = (number: string) => {
	return hash(number)
}

const streamToString = (stream: ReadableStream ): Promise<string> =>
      new Promise((resolve, reject) => {
        //@ts-ignore
        const chunks = [];
        //@ts-ignore
        stream.on("data", (chunk) => chunks.push(chunk));
        //@ts-ignore
        stream.on("error", reject);
        //@ts-ignore
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      });

export const getUserRecord = async (phoneNo: string) => {
	const hashedNumber = hashPhoneNo(phoneNo)
	console.log(
		'Bucket is ',
		config.S3_BUCKET,
		' path is  ',
		`meta/${hashedNumber}/call.json`
	)
	try {
		const result : GetObjectCommandOutput = await s3.send(
			new GetObjectCommand({
				Bucket: config.S3_BUCKET,
				Key: `meta/${hashedNumber}/call.json`
			})
		)
    //@ts-ignore
    const body = await streamToString(result.Body)
    console.log("user request result" , body)
  
		return JSON.parse(body)
	} catch (err) {
		console.log('error getting user ', err)
		return null
	}
}

export const getStoryMeta = async (userHash: string, key: string) => {
	console.log('Getting story meta for ', key)
	let result = await s3.send(
		new GetObjectCommand({
			Bucket: config.S3_BUCKET,
			Key: `uploads/${userHash}/${key}`
		})
	)
  //@ts-ignore
  let body = await streamToString(result.Body)
	return { ...JSON.parse(body), key: key }
}

export const getPreviousCalls = async (phoneNo: string) => {
	let userHash = hashPhoneNo(phoneNo)
	let { fileNames } = await listFiles(phoneNo)
  if (fileNames){
    let result = await Promise.all(
      fileNames!
        .filter((f) => f.Key!.includes('_meta.json'))
        .map((f) => getStoryMeta(userHash, f.Key!))
    )
    return result
  }
  else{
    return [] 
  }
}

const downloadFile = async (
	tmpDir: string,
	audioUrl: string
): Promise<Blob> => {
	const parsed = url.parse(audioUrl)
	const fileName = path.basename(parsed.pathname!)
	const destinationFile = path.join(tmpDir, fileName)
	const response = await fetch(audioUrl)
  const data = await response.blob();
	return data 
}

export const copyAudioFromTwillioToS3 = async (
	hashedPhone: string,
	storyId: string,
	audioUrl: string
) => {
	let tmpDir
	try {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'covid_calls'))
		let fileBlob = await downloadFile(tmpDir, audioUrl)
		await s3.send(
			new PutObjectCommand({
				Bucket: config.S3_BUCKET,
				ACL: 'private',
				Key: `uploads/${hashedPhone}/${storyId}.wav`,
				Body: fileBlob,
				ContentType: 'audio/wav'
			})
		)
	} 
  catch {
    console.log("Failed to upload mp3 file")
  }
  finally {
		if (tmpDir) {
			fs.rmSync(tmpDir, { recursive: true })
		}
	}
}


export const deleteStory = async (phoneNo: string, storyId: string )=>{
  
	const { fileNames } = await listFiles(phoneNo)
  if(! fileNames){ return 0 }

  let storyFiles = fileNames.filter((f)=>f.Key!.includes(storyId))
  await Promise.all(
    storyFiles.map(async (f)=>{
      let response = await s3.send(
        new DeleteObjectCommand({
          Bucket: config.S3_BUCKET,
          Key : f.Key
        })
      )
     })
  )
  return storyFiles.length
}

export const getExistingStories = async (phoneNo: string) => {
	const { fileNames } = await listFiles(phoneNo)
	return Promise.all(
		fileNames!
			.filter((f) => f.Key?.includes('_meta.json'))
			.map(async (f) =>{
				let response = await s3.send(
					new GetObjectCommand({
						Bucket: config.S3_BUCKET,
						Key: f.Key!
					})
				)
        //@ts-ignore
        let body = await streamToString(response.body)
        return JSON.parse(body)
        }
			)
	)
}

export const saveCallStory = async (
	phoneNo: string,
	topicId: string,
	audioUrl: string
) => {
	const storyId = nanoid()
	const hashedPhone = hash(phoneNo)

	await copyAudioFromTwillioToS3(hashedPhone, storyId, audioUrl)

	await s3.send(
		new PutObjectCommand({
			Bucket: config.S3_BUCKET,
			ACL: 'private',
			Key: `uploads/${hashedPhone}/${storyId}_meta.json`,
			Body: JSON.stringify({
				type: 'audio',
				topicId,
				uploadTimestamp: new Date().toISOString()
			}),
			ContentType: 'application/json'
		})
	)
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
		permission: false
	}
	const base = user ? user : initial_data
	console.log('Updating hash', hashedNumber)
	console.log('Update is ', { ...base, ...update })

	try {
		const result = await s3.send(
			new PutObjectCommand({
				Bucket: config.S3_BUCKET,
				Key: `meta/${hashedNumber}/call.json`,
				Body: JSON.stringify({ ...base, ...update }),
				ACL: 'private',
				ContentType: 'application/json'
			})
		)

		console.log('UPLOAD RESULT ', result)
		return user ? user : initial_data
	} catch (err) {
		console.log('Failed to create initial user ', phoneNo, err)
		throw err
	}
}
