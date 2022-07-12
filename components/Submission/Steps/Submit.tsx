import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid,
	TextField,
	Typography,
	Tabs,
	Tab
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	selectConsent,
	selectCounty,
	selectOptInResearch,
	selectTitle,
	selectType,
	setCounty,
	setTitle,
	toggleConsent,
	toggleOptInResearch,
	toggleIsUploading,
	setUploadProgress,
	selectTheme,
	selectTags,
	setTags
} from '../../../stores/submission'
import { db, resetDatabase } from '../../../stores/indexdb/db'
import { StepComponentProps } from './types'
import { CountySelect } from '../SubmissionUtil/CountySelect'
import { StoryPreview } from '../StoryPreview'
import dynamic from 'next/dynamic'
import { TagSelect } from '../SubmissionUtil/TagSelect'
import Link from 'next/link'
import { SubmissionUploadModal } from '../SubmissionUploadModal'
import { useUser } from '@auth0/nextjs-auth0'
import colors from '../../../config/colors'

const CountyPreview = dynamic(() => import('../SubmissionUtil/CountyPreview'), {
	ssr: false
})

interface UploadSpec {
	storyType: string
	fileType: string
	storyId: string
}

// helpers
const str2blob = (txt: string): Blob =>
	new Blob([txt], { type: 'text/markdown' })

const getSubmissionUrl = async (uploadSpec: UploadSpec): Promise<string> => {
	const { storyType, fileType, storyId } = uploadSpec

	const response = await fetch(
		`/api/files/request_upload?storyType=${encodeURIComponent(
			storyType
		)}&storyId=${encodeURIComponent(storyId)}&fileType=${encodeURIComponent(
			fileType
		)}`
	).then((res) => res.json())
	return response?.uploadURL
}

// submission component
export const Submit: React.FC<StepComponentProps> = ({
	storyId,
	handleNext
}) => {
	const storyType = useSelector(selectType)
	const title = useSelector(selectTitle)
	const county = useSelector(selectCounty)
	const consent = useSelector(selectConsent)
	const optInResearch = useSelector(selectOptInResearch)
	const theme = useSelector(selectTheme)
	const tags = useSelector(selectTags)
	const dispatch = useDispatch()
	const [tab, setTab] = React.useState(0)
	const [content, setContent] = useState<any | null>(null)
	const [additionalContent, setAdditionalContent] = useState<any | null>(null)
	const [isUploading, setIsUploading] = useState<boolean>(false)
	const canSubmit = consent && county?.label?.length
	const {user} = useUser()

	// load cached content
	useEffect(() => {
		const getContent = async () => {
			const entry = await db.submissions.get(0)
			if (entry?.content) {
				switch (storyType) {
					case 'written': {
						setContent(entry.content)
						return
					}
					case 'photo': {
						// @ts-ignore
						const tempUrl = URL.createObjectURL(entry.content)
						setContent(tempUrl)
						setAdditionalContent(entry.additionalContent)
						return
					}
					case 'video': {
						// @ts-ignore
						const tempUrl = URL.createObjectURL(entry.content)
						setContent(tempUrl)
						return
					}
					case 'audio': {
						// @ts-ignore
						const tempUrl = URL.createObjectURL(entry.content)
						setContent(tempUrl)
						return
					}
					default:
						return
				}
			}
		}
		getContent()
	}, [storyType])

	// handlers for UI events
	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue)
	}
	const handleTitle = (text: string) => dispatch(setTitle(text))
	const handleCounty = (
		_e: React.SyntheticEvent,
		county: { label: string; value: number }
	) => {
		if (county?.label) {
			dispatch(setCounty(county))
		} else {
			dispatch(setCounty({ label: '', value: -1 }))
		}
	}
	const handleConsent = () => dispatch(toggleConsent())
	const handleOptInResearch = () => dispatch(toggleOptInResearch())
	const handleTag = (tags: string[]) => {
		dispatch(setTags(tags))
	}

	// handlers for uploads
	const handleSuccessfulUpload = () => {
		setIsUploading(false)
		handleNext()
		resetDatabase({
			storyId: ''
		})
	}
	const handleFailedUpload = () => {
		setIsUploading(false)
		console.log('upload failed try again')
	}
	const handleSendFile = (blob: Blob, url: string, quiet: boolean = false) => {
		!quiet && setIsUploading(true)
		let request: XMLHttpRequest = new XMLHttpRequest()
		request.open('PUT', url)
		request.upload.addEventListener('progress', function (e) {
			let percent_completed: number = (e.loaded / e.total) * 100
			!quiet && dispatch(setUploadProgress(percent_completed))
		})
		request.addEventListener('load', () => {
			!quiet && handleSuccessfulUpload()
		})
		request.send(blob)
	}

	const handleSubmit = async () => {
		try {
			const entry = await db.submissions.get(0)

			if (entry?.content) {
				if (entry?.additionalContent) {
					const blob = str2blob(entry.additionalContent)
					const additionalContentUploadSpec = {
						storyType: storyType,
						fileType: blob.type,
						storyId: storyId
					}
					const additionalContentURL = await getSubmissionUrl(
						additionalContentUploadSpec
					)
					if (additionalContentURL) {
						handleSendFile(blob, additionalContentURL, true)
					}
				}

				const meta = {
					title,
					county,
					consent,
					optInResearch,
					storyId,
					storyType,
					theme,
					tags,
					date: new Date().toISOString(),
					email: user?.email
					// additionalTags
				}
				const metaBlob = str2blob(JSON.stringify(meta))
				const metaUploadSpec = {
					storyType: storyType,
					fileType: 'application/json',
					storyId: storyId
				}
				const metaUploadURL = await getSubmissionUrl(metaUploadSpec)
				if (metaUploadURL) {
					handleSendFile(metaBlob, metaUploadURL, true)
				}

				const contentBlob =
					typeof entry.content === 'string'
						? str2blob(entry.content)
						: entry.content

				const contentUploadSpec = {
					storyType: storyType,
					fileType: contentBlob.type,
					storyId: storyId
				}
				const contentUploadUrl = await getSubmissionUrl(contentUploadSpec)
				if (contentUploadUrl) {
					handleSendFile(contentBlob, contentUploadUrl)
				}
			}
		} catch {
			handleFailedUpload()
		}
	}

	return (
		<>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Typography variant="h2" sx={{ marginBottom: '.5em' }}>
						Submit Your Story
					</Typography>
					<CountySelect onChange={handleCounty} value={county} />
					<TextField
						label="What would you like to title your story? (optional)"
						value={title}
						onChange={(e) => handleTitle(e.target.value)}
						fullWidth
						sx={{ margin: '1rem 0' }}
					/>
					<TagSelect onChange={handleTag} tags={tags} />
					<Typography>By submitting your story, you agree that:</Typography>
					<ul>
						<li>
							<Typography>You are over 18</Typography>
						</li>
						<li>
							<Typography>We can publish your story</Typography>
						</li>
						<li>
							<Typography>
								You agree to the{' '}
								<Link href="/license">
									<a target="_blank" style={{ textDecoration: 'underline' }}>
										full license terms
									</a>
								</Link>
							</Typography>
						</li>
					</ul>
					<Typography>
						You get to keep your story, and use it however you’d like. At any
						time you want to remove it, come back here, login, and mark the
						story for removal.
					</Typography>
					<FormGroup sx={{pb: 2}}>
						<FormControlLabel
							control={<Checkbox onChange={handleConsent} checked={consent} sx={{color: colors.yellow}}/>}
							label="I agree to the license terms"
							sx={{color: colors.yellow}}
						/>
						<label id="combo-box-county-label" style={{color: colors.yellow}}>* required</label>
					</FormGroup>
					<Typography>
						If you’d like to be considered for paid research opportunities in
						the future. If I am selected to participate, I would receive $50
						compensation for my time.
					</Typography>
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									onChange={handleOptInResearch}
									checked={optInResearch}
								/>
							}
							label="I want to participate in future research"
						/>
					</FormGroup>
					<Button
						variant="contained"
						onClick={handleSubmit}
						disabled={!canSubmit}
						sx={{ marginTop: '1rem', textTransform: 'none' }}
					>
						Submit
					</Button>
				</Grid>
				<Grid item xs={12} md={6}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs
							value={tab}
							onChange={handleChangeTab}
							aria-label="basic tabs example"
						>
							<Tab label="Preview Your Story" {...a11yProps(0)} />
							<Tab label="Preview Your County" {...a11yProps(1)} />
						</Tabs>
					</Box>

					<TabPanel value={tab} index={0}>
						<Box sx={{ marginBottom: '2em' }}>
							<StoryPreview
								type={storyType}
								content={content}
								additionalContent={additionalContent}
							/>
						</Box>
					</TabPanel>
					<TabPanel value={tab} index={1}>
						{county && (
							<Box>
								<CountyPreview county={county} />
							</Box>
						)}
					</TabPanel>
				</Grid>
			</Grid>
			<SubmissionUploadModal open={isUploading} />
		</>
	)
}
// @ts-ignore
function TabPanel(props) {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	)
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	}
}
