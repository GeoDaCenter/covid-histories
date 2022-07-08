import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	ListObjectsCommand
} from '@aws-sdk/client-s3'
import { UserCallRecord } from './_types'
import hash from 'object-hash'
import {uploadMeta} from '../files/utils'

const REGION = 'us-west-2'
const client = new S3Client({
	region: REGION,
	credentials: {
		accessKeyId: process.env.AWS_KEY!,
		secretAccessKey: process.env.AWS_SECRET!
	}
})

const S3_BUCKET = 'allofthedata'
const BASE_FOLDER = 'histories/phone'

export const hashPhoneNo = (number: string) => {
	return hash(number)
}

export const createOrUpdateUserRecord = async (
	phoneNo: string,
	user?: UserCallRecord
) => {
	const hashedNumber = user ? user.numberHash : hashPhoneNo(phoneNo)

	const initial_data: UserCallRecord = {
		numberHash: hashedNumber,
		responses: [],
		createdAt: new Date(),
		language: "en" 
	}

	try {
		const result = client.send(
			new PutObjectCommand({
				Bucket: S3_BUCKET,
				Key: `${BASE_FOLDER}/${hashedNumber}`,
				Body: JSON.stringify(user ? user : initial_data),
				ACL: 'public-read'
			})
		)
		return user ? user : initial_data
	} catch (err) {
		console.log('Failed to create initial user ', phoneNo, err)
		throw err
	}
}

export const getUserRecord = async (
	phoneNo: string
): Promise<UserCallRecord | null> => {
	const hashedNumber = hashPhoneNo(phoneNo)
	try {
		const resp = await fetch(
			`https://${S3_BUCKET}.s3.us-west-2.amazonaws.com/histories/phone/${encodeURIComponent(
				hashedNumber
			)}`
		)
		const user = await resp.json()
		return user as UserCallRecord
	} catch {
		return null
	}
}

export const getOrCreateUserRecord = async (
	phoneNo: string
): Promise<UserCallRecord> => {
	const record = await getUserRecord(phoneNo)
	if (record) {
		return record
	} else {
		return await createOrUpdateUserRecord(phoneNo)
	}
}

export const getListOfCalls = async () => {
	let response = await client.send(
		new ListObjectsCommand({
			Bucket: S3_BUCKET,
			Prefix: BASE_FOLDER
		})
	)

	let numbers = response.Contents?.map(
		(c) => c.Key?.split(BASE_FOLDER + '/')[1]
	).filter((c) => c)
	return numbers
}
