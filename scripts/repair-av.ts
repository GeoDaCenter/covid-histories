import { S3Client } from '@aws-sdk/client-s3'
import { getFileList, getPresignedUrl, upload } from '../pages/api/files/utils'
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
	).split('\n')
	let filesToSkip = readFileSync(
		'./scripts/skip-repairs.txt',
		'utf8'
	).split('\n')
	console.log(filesToSkip.length, "video ids marked to be skipped:", filesToSkip)
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
				!filesToSkip.includes(id!) &&
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
		console.log("ffmpeg initialized");
		const doTranscode = async (filePath: string, isVideo: boolean) => {
			console.log("doTranscode:", filePath)
			console.log("getting file...")
			ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(filePath))
			console.log("processing file...")
			await ffmpeg.run(
				'-i',
				'input.mp4',
				// force H.264 encoding, better for streaming and compression
				'-c:v',
				'libx264',
				// using the aac audio encoder threw a "Pthread aborting at Error"
				// error during testing, so just using copy
				'-c:a',
				'copy',
				'-movflags',
				'faststart',
				'output.mp4'
			)
			console.log("creating preview thumbnail...")
			isVideo &&
				(await ffmpeg.run(
					'-i',
					'input.mp4',
					'-threads',
					'1',
					'-vf',
					'scale=320:-1',
					'-ss',
					'1',
					'-vframes',
					'1',
					'output.gif'
				))
			console.log("doTranscode complete.")
			return {
				media: ffmpeg.FS('readFile', 'output.mp4'),
				gif: isVideo && ffmpeg.FS('readFile', 'output.gif')
			}
		}
		console.log("beginning loop...");
		console.log(process.env.REPAIR_AV_FILE_LIMIT)

		// loop through, fetch file, transcode, upload
		for (let i = 0; i < uploadContents.length; i++) {
			if (process.env.REPAIR_AV_FILE_LIMIT != "0" && i.toString() == process.env.REPAIR_AV_FILE_LIMIT) {break}
			const Key = uploadContents[i].Key!
			const id = uploadContents[i].id!
			const fileType = uploadContents[i].fileType!
			const mimeType = fileType === 'mp4' ? 'video/mp4' : 'audio/mpeg'
			const isVideo = fileType === 'mp4'
			try {
				const response = await getPresignedUrl({
					Key,
					ContentType: mimeType,
					operation: 'getObject'
				})
					.then((r) => r.url!)
					.then((url) => doTranscode(url, isVideo))
					.then(({ media, gif }) => {
						console.log('uploading preview gif...')
						isVideo && upload(s3, `previewGifs/${id}.gif`, 'image/gif', gif)
						console.log('uploading video...')
						const mediaResponse = upload(s3, Key, mimeType, media)
						return mediaResponse
					})
				console.log(response)
				if (response['$metadata'].httpStatusCode === 200) {
					completedRepairs.push(id)
					writeFileSync(
						'./scripts/completed-repairs.txt',
						completedRepairs.join('\n')
					)
				}
			} catch (e) {
				console.log('Repair failed', id, e)
			}
		}
	}
}

main().then((r) => process.exit(0))
