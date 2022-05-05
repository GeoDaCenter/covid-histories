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
import React from 'react'
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
	selectTheme
} from '../../../stores/submission'
import * as StoryInput from '../StoryInput'
import { db, resetDatabase } from '../../../stores/indexdb/db'
import { StepComponentProps } from './types'
import { CountySelect } from '../SubmissionUtil/CountySelect'
import { StoryPreview } from '../StoryPreview'
import dynamic from 'next/dynamic'

const CountyPreview = dynamic(() => import('../SubmissionUtil/CountyPreview'), {
	ssr: false
})

const str2blob = (txt: string): Blob =>
	new Blob([txt], { type: 'text/markdown' })

const getSubmissionUrl = async (storyId: string, type: string, additionalParams?: string): Promise<string> => {
	const response = await fetch(
		`/api/upload/request_url?type=${type}&key=${storyId}${additionalParams||''}`
	).then((res) => res.json())
	return response?.uploadURL
}

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
	const dispatch = useDispatch()
	const [tab, setTab] = React.useState(0)

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
	const handleSuccessfulUpload = () => {
		dispatch(toggleIsUploading())
		handleNext()
		resetDatabase({
			storyId: ''
		})
	}
	const handleFailedUpload = () => {
		dispatch(toggleIsUploading())
		console.log('upload failed try again')
	}
	const handleSendFile = (blob: Blob, url: string, quiet: boolean = false) => {
		!quiet && dispatch(toggleIsUploading())
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
		const entry = await db.submissions.get(0)
		if (entry?.additionalContent) {
			const additionalContentURL = await getSubmissionUrl(storyId, 'written')
			if (additionalContentURL) {
				const blob = str2blob(entry.additionalContent)
				handleSendFile(blob, additionalContentURL, true)
			}
		}
		const metaUploadURL = await getSubmissionUrl(storyId + "_meta", 'meta')
		if (metaUploadURL) {
			const meta = {
				title,
				county,
				consent,
				storyId,
				storyType,
				theme,
				date: new Date().toISOString(),
				// additionalTags
			}
			const blob = str2blob(JSON.stringify(meta))
			handleSendFile(blob, metaUploadURL, true)
		}

		// @ts-ignore
		const additionalParams = storyType === 'photo' && entry?.content?.type
			// @ts-ignore
			? '&fileType=' + entry?.content?.type
			: ''

		const uploadURL = await getSubmissionUrl(storyId, storyType, additionalParams)

		if (uploadURL && entry?.content) {
			try {
				const blob = entry.type === 'written'
					? str2blob(entry.content)
					: entry.content

				if (typeof blob === 'object') {
					handleSendFile(blob, uploadURL)
				}
			} catch {
				handleFailedUpload()
			}
		}
	}

	const canSubmit = consent && county?.label?.length

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={6}>
				<Typography variant="h2" sx={{ marginBottom: '.5em' }}>Submit Your Story</Typography>
				<CountySelect onChange={handleCounty} value={county} />
				<TextField
					label="What would you like to title your story? (optional)"
					value={title}
					onChange={(e) => handleTitle(e.target.value)}
					fullWidth
					sx={{ margin: '1rem 0' }}
				/>
				<Typography>By submitting your story, you agree that:</Typography>
				<ul>
					<li>
						<Typography>You are over 18</Typography>
					</li>
					<li>
						<Typography>We can publish your story</Typography>
					</li>
					<li>
						<Typography>You agree to the full license terms [here]</Typography>
					</li>
				</ul>
				<Typography>
					You get to keep your story, and use it however you’d like. At any time
					you want to remove it, come back here, login, and mark the story for
					removal.
				</Typography>
				<FormGroup>
					<FormControlLabel
						control={<Checkbox onChange={handleConsent} checked={consent} />}
						label="I agree to the license terms"
					/>
				</FormGroup>
				<Typography>
					If you’d like to be considered for paid research opportunities in the
					future. If I am selected to participate, I would receive $50
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
						<StoryPreview type={storyType} />
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
