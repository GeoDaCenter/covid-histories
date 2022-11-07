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
import axios from 'axios'
import 'dotenv/config'
import { StoryProps } from '../pages/my-stories'

const REGION = process.env.APP_AWS_REGION!
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
	id: string
	fips: number
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
		const approvalStatus = TagSet?.find((f) => f.Key === 'status')?.Value

		if (approvalStatus === 'approved') {
			const uploadCounts = uploadContents.filter(f => f.id === id)
			if (uploadCounts.length === 1) {
				publicFiles.push({ id: id!, Key: Key!, fileType: fileType! })
			}
			if (uploadCounts.length > 1 && fileType !== '.md') {
				publicFiles.push({ id: id!, Key: Key!, fileType: fileType! })
			}
		}
		if (approvalStatus === 'approved' && publicFile !== undefined) {
			continue
		} else if (approvalStatus === 'approved' && publicFile === undefined) {
			const _response = await copyObject(Key!, `public/${id}${fileType}`)
		} else if (approvalStatus !== 'approved' && publicFile !== undefined) {
			const _response = await deleteObject(publicFile.Key!)
		}
	}

	// loop through public files
	// if missing from uplodas, this means they were delete
	// if so, delete
	for (let i = 0; i < publicContents.length; i++) {
		const { Key, id } = publicContents[i]

		const fileType = '.' + Key?.split('.').slice(-1)[0]
		if (fileType === ".vtt") continue
		
		const uploadFile = uploadContents.find(
			({ id: uploadId }) => uploadId === id
		)

		if (uploadFile === undefined) {
			const _response = await deleteObject(Key!)
		}
	}

	// build index file
	const existingMeta = await getPresignedUrl({
		Key: 'public/index.json',
		operation: 'getObject'
	}).then((response) =>
		response?.url
			? axios(response.url).then(
					(res) => res.data as Promise<PublicSubmission[]>
			  )
			: []
	).catch(e => {
		console.log(e)
		return []
	})

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
							return axios(fileMetaUrl.url).then((res) => {
								if (res && res.data) {
									return res.data as Promise<StoryProps>
								}
								return null
							}).catch(e => console.log(fileMetaUrl.url))
						} else {
							throw new Error('Error: Could not get file meta')
						}
					})
					.then((submission) => {
						if (submission) {
							const { title, fips, storyType, theme, tags } = submission
							return {
								id,
								title,
								fips,
								theme,
								tags: tags || [],
								type: storyType,
								fileType
							}
						} else {
							return {
								id: '',
								title: '',
								fips:-1,
								theme: '',
								tags: [],
								type: '',
								fileType: ''
							}
						}
					})
			}
		}
	)

	const fileResults = await Promise.all(fileIndexPromises)
	const fileMeta = fileResults.filter(({ id }) => id.length)
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
