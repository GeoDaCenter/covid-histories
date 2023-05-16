import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	Stack,
	Grid,
	TextField
} from '@mui/material'
import React, { useCallback, useState, useEffect } from 'react'
import { SEO } from '../components/Interface/SEO'
import { SubmissionForm } from '../components/Submission/SubmissionUtil/SubmissionForm'
import { setType, store } from '../stores/submission'
import { Provider } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import {
	selectConsent,
	selectCounty,
	selectOptInResearch,
	selectTitle,
	selectType,
	selectTheme,
	selectTags
} from '../stores/submission'

import {
	selectSelfIdentifiedRace,
	selectPerceivedIdentifiedRace,
	selectGenderIdentity,
	selectAge,
	selectPlaceUrbanicity,
	selectAdditionalDescription
} from '../stores/survey'

import { nanoid } from '@reduxjs/toolkit'
import { YourCovidExperience } from '../components/Submission/Steps'
import { Survey } from '../components/Submission/Steps'
import { useDropzone } from 'react-dropzone'
import colors from '../config/colors'
import objectHash from 'object-hash'
import { SubmissionTypes } from '../stores/submission/submissionSlice'
import { storyTypeOptions } from '../components/Submission/Steps/StoryType'
import { useRouter } from 'next/router'

// helpers
const str2blob = (txt: string): Blob =>
	new Blob([txt], { type: 'text/markdown' })

interface UploadSpec {
	fileType: string
	key: string
	email: string
	folder: string
}

interface FileSource {
	name: string
	url: string
	type: string
}

const CORRECT_FILE_TYPES = {
	"written": [".md"],
	"audio": [".mp3"],
	"phone": [".mp3"],
	"photo": [".jpg", ".jpeg", ".png", ".gif", "or others"],
	"video": [".mp4"],
}

const getSubmissionUrl = async (uploadSpec: UploadSpec): Promise<string> => {
	const { fileType, key, email, folder } = uploadSpec
	console.log("uploadspec in getSubmissionUrl")
	console.log(uploadspec)

	const response = await fetch(
		`/api/admin/upload?key=${encodeURIComponent(key)}
            &fileType=${encodeURIComponent(fileType)}
            &email=${encodeURIComponent(email)}
            &folder=${encodeURIComponent(folder)}`
	).then((res) => res.json())

	return response?.uploadURL
}

const ManualFileUpload: React.FC<{
	fileSource: FileSource
	setFileSource: (fileSource: FileSource) => void
}> = ({ fileSource, setFileSource }) => {
	const onDrop = useCallback((acceptedFiles: any[]) => {
		const urlObject = URL.createObjectURL(acceptedFiles[0])
		setFileSource({
			name: acceptedFiles[0].path,
			url: urlObject,
			type: acceptedFiles[0].type
		})
	}, []) // eslint-disable-line

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop
	})

	return (
		<Box sx={{ width: '100%', flexGrow: 1 }}>
			{!!fileSource?.url && (
				<Box>
					<p>
						{fileSource.name} ({fileSource.type})
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
						Drop your file here.
						<br />
					</p>
				) : (
					<p>
						<span className="material-icons">input</span>
						<br />
						Drag and drop your file here, or click to select files.
						<br />
					</p>
				)}
			</Button>
		</Box>
	)
}

const AdminInner: React.FC = () => {
	const [isUploading, setIsUploading] = useState(false)
	const [userEmail, setUserEmail] = useState('')
	const [storyId] = useState(nanoid())

	const dispatch = useDispatch()

	// submission
	const storyType = useSelector(selectType)
	const title = useSelector(selectTitle)
	const county = useSelector(selectCounty)
	const consent = useSelector(selectConsent)
	const optInResearch = useSelector(selectOptInResearch)
	const theme = useSelector(selectTheme)
	const tags = useSelector(selectTags)

	// survey
	const selfIdentifiedRace = useSelector(selectSelfIdentifiedRace)
	const perceivedIdentifiedRace = useSelector(selectPerceivedIdentifiedRace)
	const genderIdentity = useSelector(selectGenderIdentity)
	const age = useSelector(selectAge)
	const placeUrbanicity = useSelector(selectPlaceUrbanicity)
	const additionalDescription = useSelector(selectAdditionalDescription)

	const handleType = (type: SubmissionTypes) => {
		dispatch(setType(type))
	}

	const handleSendFile = async (blob: Blob, url: string) => {
		return await fetch(url, {
			method: 'PUT',
			body: blob
		}).then((r) => console.log(r))
	}

	const [fileSource, setFileSource] = useState<FileSource>({
		url: '',
		type: '',
		name: ''
	})
	const [additionalFileSource, setAdditionalFileSource] = useState<FileSource>({
		url: '',
		type: '',
		name: ''
	})

	const handleSubmit = async () => {
		try {
			setIsUploading(true)
			// story meta
			const meta = {
				title,
				fips: county?.value,
				consent,
				optInResearch,
				storyId,
				storyType,
				theme,
				tags,
				date: new Date().toISOString(),
				email: userEmail
			}
			const metaBlob = str2blob(JSON.stringify(meta))
			const metaUploadSpec = {
				fileType: 'application/json',
				key: `${storyId}_meta.json`,
				email: userEmail,
				folder: 'uploads'
			}
			console.log(metaUploadSpec)
			const metaUploadURL = await getSubmissionUrl(metaUploadSpec)
			console.log(metaUploadUrl)
			await handleSendFile(metaBlob, metaUploadURL)
			// survey
			const survey = {
				email: userEmail,
				selfIdentifiedRace,
				perceivedIdentifiedRace,
				genderIdentity,
				age,
				placeUrbanicity,
				additionalDescription
			}

			const surveyBlob = str2blob(JSON.stringify(survey))
			const surveyUploadSpec = {
				fileType: 'application/json',
				key: `survey.json`,
				email: userEmail,
				folder: 'meta'
			}

			const surveyUploadURL = await getSubmissionUrl(surveyUploadSpec)
			await handleSendFile(surveyBlob, surveyUploadURL)

			if (storyType === "photo") {
				// story content
				const data = await fetch(additionalFileSource.url).then((r) => r.blob())
				const contentBlob = new Blob([data], { type: additionalFileSource.type })
				const contentUploadSpec = {
					key: `${storyId}.${additionalFileSource.name.split('.').slice(-1,)[0]}`,
					folder: 'uploads',
					fileType: contentBlob.type,
					email: userEmail
				}
				const contentUploadUrl = await getSubmissionUrl(contentUploadSpec)
				await handleSendFile(contentBlob, contentUploadUrl)
			}

			// story content
			const data = await fetch(fileSource.url).then((r) => r.blob())
			const contentBlob = new Blob([data], { type: fileSource.type })
			const contentUploadSpec = {
				key: `${storyId}.${fileSource.name.split('.').slice(-1,)[0]}`,
				folder: 'uploads',
				fileType: contentBlob.type,
				email: userEmail
			}
			const contentUploadUrl = await getSubmissionUrl(contentUploadSpec)
			await handleSendFile(contentBlob, contentUploadUrl)
		} catch {
			alert('upload failed')
		}
	}

	return (
		<div className={styles.container} style={{ padding: '1em' }}>
			<SEO title="Admin" />
			<Modal open={isUploading}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						background: 'black',
						padding: '2em',
						transform: 'translate(-50%, -50%)'
					}}
				>
					<h3>Uploading...</h3>
				</Box>
			</Modal>
			<Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
				<Stack
					direction="column"
					spacing={3}
					justifyContent="center"
					alignItems="center"
				>
					<h1>Admin Upload</h1>
					<Stack direction="row" gap={3}>
						<Box>
							<h2>Submission Email</h2>
							<TextField
								value={userEmail}
								onChange={(e) => setUserEmail(e.target.value)}
							/>
						</Box>
						<Box>
							<h2>Submission Type</h2>
							<FormControl fullWidth>
								<InputLabel id="submission-type-label">
									Submission Type
								</InputLabel>
								<Select
									labelId="submission-type-label"
									id="submission-type"
									value={storyType}
									label="Submission Type"
									onChange={(e) =>
										handleType(e.target.value as SubmissionTypes)
									}
								>
									{storyTypeOptions.map((f) => (
										<MenuItem value={f.type} key={f.type}>
											{f.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					</Stack>
					<Grid container>
						<Grid item xs={12} md={storyType === "photo" ? 6 : 12}>
							<h2>Media / Story File</h2>
							<ManualFileUpload
								setFileSource={setFileSource}
								fileSource={fileSource}
							/>
							<h3>({CORRECT_FILE_TYPES?.[storyType].join(", ")})</h3>
						</Grid>
						{storyType === 'photo' && (
							<Grid item xs={12} md={6}>
								<h2>Caption File</h2>
								<ManualFileUpload
									setFileSource={setAdditionalFileSource}
									fileSource={additionalFileSource}
								/>
								<h3>({CORRECT_FILE_TYPES?.['written'].join(", ")})</h3>
							</Grid>
						)}
					</Grid>

				</Stack>
				<h2>Topic</h2>
				<YourCovidExperience quiet />
				<h2>Submission Info</h2>
				<SubmissionForm handleNext={() => { }} storyId={storyId} quiet />
				<h2>Survey</h2>
				{/* @ts-ignore */}
				<Survey allowSubmit={false} isAdmin={true} />
				<Button
					variant="contained"
					onClick={() => handleSubmit().then(() => setIsUploading(false))}
				>
					Submit
				</Button>
			</Box>
		</div>
	)
}
const AdminOuter: NextPage<{ accessToken: string }> = ({ accessToken }) => {
	const { user } = useUser()
	const isAdmin = //@ts-ignore
		user && user?.['https://stories.uscovidatlas.org/roles']?.includes('Admin')
	const router = useRouter()
	console.log(objectHash('test@test.com'))
	if (!isAdmin) {
		typeof window !== 'undefined' && router.push('/')
		return <div>Not authorized</div>
	}
	return (
		<Provider store={store}>
			<AdminInner />
		</Provider>
	)
}

export default withPageAuthRequired(AdminOuter)
