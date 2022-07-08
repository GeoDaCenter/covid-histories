import { Box, Button } from '@mui/material'
import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import colors from '../../../../config/colors'
import { db } from '../../../../stores/indexdb/db'
import { SubmissionDraft } from '../../../../stores/indexdb/SubmissionDraft'

const PreviewImage = styled.img`
	max-width: 100%;
	background: white;
	border: 1px solid ${colors.gray};
	padding: 1em;
`

interface PhotoLoaderProps {
	handleCacheStory: (content: string) => void
	storyId: string | undefined
	dbActive: boolean
	getCachedEntry: (entry: SubmissionDraft | undefined) => string | Blob | undefined
}

const ACCEPTED_FILE_TYPES = [
	'image/jpeg',
	'image/png',
	'image/tiff',
	'image/gif',
	'image/bmp',
	'image/heic',
	'image/heif',
	'application/pdf',
	'image/webp',
	'image/svg+xml'
]

export const PhotoLoader: React.FC<PhotoLoaderProps> = ({
	handleCacheStory,
	storyId,
	getCachedEntry,
	dbActive
}) => {
	const [photoSource, setPhotoSource] = useState<{ url: string; type: string }>(
		{
			url: '',
			type: ''
		}
	)
	const [error, setError] = useState<string | null>(null)

	const onDrop = useCallback((acceptedFiles: any[]) => {
		console.log(acceptedFiles)
		if (!acceptedFiles || !acceptedFiles.length) {
			setError('No file selected')
		} else if (!ACCEPTED_FILE_TYPES.includes(acceptedFiles[0].type)) {
			setError(
				`That file type isn't allowed. Please select a jpg, png, tiff, gif, or bmp file. (You selected ${acceptedFiles[0].name}, ${acceptedFiles[0].type} file)`
			)
		} else {
			const urlObject = URL.createObjectURL(acceptedFiles[0])
			setError(null)
			setPhotoSource({
				url: urlObject,
				type: acceptedFiles[0].type
			})
			handleCacheStory(urlObject)
		}
	}, []) // eslint-disable-line

	useEffect(() => {
		if (db && storyId?.length) {
			db.submissions.get(0).then((entry) => {
				const cachedContent = getCachedEntry(entry)
				if (cachedContent) {
					setPhotoSource({
						//@ts-ignore
						url: URL.createObjectURL(cachedContent),
						// @ts-ignore
						type: cachedContent.type
					})
				}
			})
		}
	}, [dbActive, storyId]) // eslint-disable-line

	useEffect(() => {
		if (photoSource) {
			const generateBlob = async () => {
				const data = await fetch(photoSource.url).then((r) => r.blob())
				const blob = new Blob([data], { type: photoSource.type })
				// @ts-ignore
				handleCacheStory(blob)
			}
			generateBlob()
		}
	}, [photoSource]) // eslint-disable-line

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop
	})

	return (
		<Box
			sx={{
				background: colors.darkgray,
				padding: '1em',
				border: `1px solid ${colors.gray}`
			}}
		>
			{!!photoSource?.url && (
				<Box>
					<PreviewImage src={photoSource.url} alt="story photo" />
					<p>
						<b>Preview your image.</b> If you would like to submit a different
						image, please click the button below.
					</p>
				</Box>
			)}
			{error && (
				<Box
					sx={{
						borderLeft: `2px solid ${colors.red}`,
						padding: '0 0 0 1em',
						marginBottom: '2em'
					}}
				>
					<p>
						<span className="material-icons" style={{ color: colors.red }}>
							error
						</span>
						<br />
						{error}
					</p>
				</Box>
			)}
			<Button
				{...getRootProps()}
				sx={{
					border: `1px solid ${colors.yellow}`,
					textTransform: 'none',
					width: '100%',
					minHeight: '100px'
				}}
			>
				<input {...getInputProps()} />
				{isDragActive ? (
					<p>
						<span className="material-icons">input</span>
						<br />
						Drop your photo here.
						<br />
						<br />
					</p>
				) : (
					<p>
						<span className="material-icons">input</span>
						<br />
						Drag and drop your image here, or click to select files.
						<br />
						<i>
							Supported file types: jpg, png, gif, bmp, tif, heic, pdf, webp,
							and svg.
						</i>
					</p>
				)}
			</Button>
		</Box>
	)
}
