import {
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid,
	TextField
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
	setUploadProgress
} from '../../../stores/submission'
import * as StoryInput from '../StoryInput'
import { db, resetDatabase } from '../../../stores/indexdb/db'
import { StepComponentProps } from './types'
import { CountySelect } from '../SubmissionUtil/CountySelect'

const str2blob = (txt: string): Blob => new Blob([txt], { type: 'text/markdown' })
const base64ToBlob = (base64: string, type: string) => {
	const byteCharacters = atob(base64)
	const byteNumbers = new Array(byteCharacters.length)
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i)
	}
	const byteArray = new Uint8Array(byteNumbers)
	const blob = new Blob([byteArray], { type })
	return blob
}

export const Submit: React.FC<StepComponentProps> = ({ storyId, handleNext }) => {
	const storyType = useSelector(selectType)
	const title = useSelector(selectTitle)
	const county = useSelector(selectCounty)
	const consent = useSelector(selectConsent)
	const optInResearch = useSelector(selectOptInResearch)
	const dispatch = useDispatch()

	const handleTitle = (text: string) => dispatch(setTitle(text))
	const handleCounty = (_e: React.SyntheticEvent, county: {label:string, value:number}) => {
		if (county?.label) {
			dispatch(setCounty(county))
		} else {
			dispatch(setCounty({label:'', value:-1}))
		}
	}
	const handleConsent = () => dispatch(toggleConsent())
	const handleOptInResearch = () => dispatch(toggleOptInResearch())
	const handleSuccessfulUpload = () => {
		dispatch(toggleIsUploading())
		handleNext()
		resetDatabase({
			storyId: ""
		})
	}
	const handleFailedUpload = () => {
		dispatch(toggleIsUploading())
		console.log('upload failed try again')
	}
	const handleSendFile = (blob: Blob, url: string, quiet:boolean=false) => {
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
			const response = await fetch(
				`/api/upload/request_url?type=written&key=${storyId}`
			).then((res) => res.json())
			const { uploadURL, fileName, ContentType } = response
			if (fileName && uploadURL) {
				const blob = str2blob(entry.additionalContent)
				handleSendFile(blob, uploadURL, true)
			}
		}
		let fetchUrl = `/api/upload/request_url?type=${storyType}&key=${storyId}`
		// @ts-ignore
		if (storyType === 'photo' && entry?.content?.type) {
			// @ts-ignore
			fetchUrl += '&fileType=' + entry?.content?.type
		}
		const response = await fetch(fetchUrl).then((res) => res.json())
		const { uploadURL, fileName, ContentType } = response
		if (fileName && uploadURL && entry?.content) {
			try {
                const blob = entry.type === "written"
                    ? str2blob(entry.content)
                    : entry.content
                if (typeof blob === 'object'){
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
			<Grid item xs={12}>
				<h2>Submit your story</h2>
			</Grid>
			<Grid item xs={12} md={6}>
				<CountySelect onChange={handleCounty} value={county} />
				<br />
				<br />
				<TextField
					label="What would you like to title your story? (optional)"
					value={title}
					onChange={(e) => handleTitle(e.target.value)}
					fullWidth
				/>
				<p>
					By submitting your story, you agree that:
					<ul>
						<li>You are over 18</li>
						<li>We can publish your story</li>
						<li>You agree to the full license terms [here]</li>
					</ul>
					You get to keep your story, and use it however you’d like. At any time
					you want to remove it, come back here, login, and mark the story for
					removal.
				</p>
				<FormGroup>
					<FormControlLabel
						control={<Checkbox onChange={handleConsent} checked={consent} />}
						label="I agree to the license terms"
					/>
				</FormGroup>
				<p>
					If you’d like to be considered for paid research opportunities in the
					future. If I am selected to participate, I would receive $50
					compensation for my time.
				</p>
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
				<br />
				<br />
			</Grid>
			<Grid item xs={12} md={6}>
				Story preview
				<br />
				<br />
				<Button
					variant="contained"
					onClick={handleSubmit}
					disabled={!canSubmit}
				>
					Submit
				</Button>
			</Grid>
		</Grid>
	)
}
