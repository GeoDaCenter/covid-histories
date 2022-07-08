import { S3Client } from '@aws-sdk/client-s3'
import { getFileList, getPresignedUrl,upload } from '../pages/api/files/utils'
import 'dotenv/config'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { writeFileSync, readFileSync } from 'fs'

const S3_BUCKET = process.env.APP_AWS_BUCKET!
const REGION = process.env.APP_AWS_REGION!
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
	fileType: string | undefined
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
	return ffmpeg
}

async function main() {
	// get the full file list
	// from uploads (raw)
	// and public folders
	const uploadFileList = await getFileList('uploads/')
	// running log of cleaned files, local to repo
	let completedRepairs = readFileSync(
		'./scripts/completed-repairs.txt',
		'utf8'
	).split(',')
	// get a list of files, slim to essential
	// filter for files needing repairs (mp4/mp3) and have not been repaired
	const uploadContents: FileObject[] = uploadFileList?.Contents?.filter(
		({ Key }) => !!Key && !Key.includes('_meta.json')
	)
		.map(({ Key, LastModified }) => ({
			Key: Key || '',
			LastModified,
			id: Key && Key.split('/').slice(-1)[0].split('.')[0],
			fileType: Key?.split('.').slice(-1)[0]
		}))
		.filter(
			({ id, fileType }) =>
				!completedRepairs.includes(id!) &&
				(fileType === 'mp4' || fileType === 'mp3')
		)!

	// if none, bueno
	if (uploadContents.length === 0) {
		console.log('No files to repair. Exiting.')
	} else {
		console.log(`Found ${uploadContents.length} files to repair.`)
		// init ffmpeg and transcode function
		// for mp4 files, this will also generate a gif
		const ffmpeg = await initFfmpeg()
		const doTranscode = async (filePath: string, isVideo: boolean) => {
			ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(filePath))
			await ffmpeg.run('-i', 'input.mp4', '-c', 'copy', 'output.mp4')
			isVideo && await ffmpeg.run('-i', 'input.mp4', '-vf','scale=320:-1, fps=1', 'output.gif')
			return {
				media: ffmpeg.FS('readFile', 'output.mp4'),
				gif: isVideo && ffmpeg.FS('readFile', 'output.gif'),
			}
		}

		// loop through, fetch file, transcode, upload
		for (let i = 0; i < uploadContents.length; i++) {
			const Key = uploadContents[i].Key!
			const id = uploadContents[i].id!
			const fileType = uploadContents[i].fileType!
			const mimeType = fileType === 'mp4' ? 'video/mp4' : 'audio/mp3'
			const isVideo = fileType === 'mp4'
			try {
				const response = await getPresignedUrl({
					Key,
					ContentType: mimeType,
					operation: 'getObject'
				})
					.then((r) => r.url!)
					.then((url) => doTranscode(url, isVideo))
					.then(({media, gif}) => {
						isVideo && upload(s3, `previewGifs/${id}.gif`, 'image/gif', gif)
						const mediaResponse = upload(s3, Key, mimeType, media)
						return mediaResponse
					})
				if (response['$metadata'].httpStatusCode === 200) {
					completedRepairs.push(id)
					writeFileSync(
						'./scripts/completed-repairs.txt',
						completedRepairs.join(',')
					)
				}
			} catch (e) {
				console.log('Repair failed', id, e)
			}
		}
	}
}

main().then((r) => process.exit(0))
