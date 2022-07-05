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
	putObject,
	upload
} from '../pages/api/files/utils'
import axios from 'axios'
import 'dotenv/config'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { writeFileSync, readFileSync } from 'fs'

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

async function initFfmpeg() {
	const ffmpeg = createFFmpeg({
		log: false
	})
	await ffmpeg.load()
	console.log('ffmpeg loaded')
	return ffmpeg
}

async function main() {
	// get the full file list
	// from uploads (raw)
	// and public folders
	const uploadFileList = await getFileList(s3, S3_BUCKET, 'uploads/')
	const ffmpeg = await initFfmpeg()

	const doTranscode = async (filePath: string) => {
		ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(filePath))
		await ffmpeg.run('-i', 'input.mp4', '-c', 'copy', 'output.mp4')
		const data = ffmpeg.FS('readFile', 'output.mp4')
		return data
	}

	// clean to essential data needed
	let completedRepairs = readFileSync(
		'./scripts/completed-repairs.txt',
		'utf8'
	).split(',')
	const uploadContents: FileObject[] = uploadFileList?.Contents?.filter(
		({ Key }) => !!Key && !Key.includes('_meta.json')
	)
		.map(({ Key, LastModified }) => ({
			Key: Key || '',
			LastModified,
			id: Key && Key.split('/').slice(-1)[0].split('.')[0]
		}))
		.filter(({ id }) => !completedRepairs.includes(id!))!
		
	console.log('REPAIRING FILES')

	for (let i = 0; i < uploadContents.length; i++) {
		const Key = uploadContents[i].Key!
		const id = uploadContents[i].id!
		const fileType = '.' + Key?.split('.').slice(-1)[0]
		try {
			if (fileType === '.mp3' || fileType === '.mp4') {
				const response = await getPresignedUrl(
					s3,
					Key,
					'video/mp4',
					'',
					'getObject'
				)
					.then((r) => r.url!)
					.then((url) => doTranscode(url))
					.then((data) => upload(s3, Key, 'video/mp4', data))
				if (response['$metadata'].httpStatusCode) {
					completedRepairs.push(id)
					writeFileSync(
						'./scripts/completed-repairs.txt',
						completedRepairs.join(',')
					)
					console.log('REPAIR COMPLETED', id)
				}
			}
		} catch (e) {
			console.log('REPAIR FAILED', id)
		}
	}
}

main().then((r) => process.exit(0))
