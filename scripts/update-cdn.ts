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
import axios from 'axios'
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
	const uploadFileList = await getFileList(s3, S3_BUCKET, 'uploads/')
	const publicFileList = await getFileList(s3, S3_BUCKET, 'public/')

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
		uploadContents.map(({ Key }) => getObjectTags(s3, S3_BUCKET, Key!))
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
			const _response = await copyObject(
				s3,
				REGION,
				ACCOUNT_ID,
				S3_BUCKET,
				Key!,
				`public/${id}.${fileType}`
			)
		} else if (approvalStatus === 'false' && publicFile !== undefined) {
			const _response = await deleteObject(s3, S3_BUCKET, publicFile.Key!)
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
			const _response = await deleteObject(s3, S3_BUCKET, Key!)
		}
	}

	// build index file
	// @ts-ignore
	const existingMeta: PublicSubmission[] = await getPresignedUrl(
		s3,
		'public/index.json',
		'',
		'',
		'getObject'
	)
		.then((response) => {
			if (response && response?.url) {
				return axios(response.url).then(r => r.data)
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
				return getPresignedUrl(
					s3,
					`${Key.split(fileType)[0]}_meta.json`,
					'',
					'',
					'getObject'
				)
					.then((fileMetaUrl) => {
						if (fileMetaUrl && fileMetaUrl?.url) {
							return axios(fileMetaUrl.url).then(r => {
								if (r && r.data && r.data?.json) {
									// @ts-ignore
									return data.json() as DistributionMeta
								}
								return null
							})
						} else {
							throw new Error('Error: Could not get file meta')
						}
					})
					.then((data) => {
						if (!data) {
							throw new Error('Error: Could not get file meta')
						} else {
                            // @ts-ignore
							const { title, county, storyType, theme, tags } = data

							return {
								id,
								title,
								county: county?.label,
								centroid: county?.centroid,
								theme,
								tags: tags || [],
								type: storyType,
								fileType
							} as PublicSubmission
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
						} as PublicSubmission
					})
			}
		}
	)
	const fileMeta: PublicSubmission[] = await Promise.all(
		fileIndexPromises
	).then((results) => results.filter(({ id }) => id.length))
	const _fileMetaResponse = await putObject(
		s3,
		S3_BUCKET,
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
