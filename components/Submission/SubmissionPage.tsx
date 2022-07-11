// BASE
import React, { useEffect, useState } from 'react'
// STORE
import { useDispatch, useSelector } from 'react-redux'
import {
	incrementStep,
	decrementStep,
	selectStep,
	selectId,
	selectType,
	selectTheme,
	setTheme,
	resetSubmission,
	setHasEnteredContent
} from '../../stores/submission'
import { db, resetDatabase } from '../../stores/indexdb/db'
// UI
import { Alert, Box, Button, Snackbar } from '@mui/material'
// COMPONENTS
import { SubmissionStepper } from './SubmissionStepper'
import * as Steps from './Steps'
import { SubmissionDraft } from '../../stores/indexdb/SubmissionDraft'
import { SubmissionUploadModal } from './SubmissionUploadModal'
import {
	SubmissionState,
	SubmissionStateOuter,
	SubmissionTypes
} from '../../stores/submission/submissionSlice'
import { useRouter } from 'next/router'

const stepsText = [
	'Intro',
	'Get Started',
	'Choose Story Type',
	'Choose Story Topic',
	'Login',
	'Make your Story',
	'Submit',
	'Survey'
]

const stepComponents = {
	0: Steps.Intro,
	1: Steps.GettingStarted,
	2: Steps.StoryType,
	3: Steps.YourCovidExperience,
	4: Steps.Login,
	5: Steps.InputStory,
	6: Steps.Submit,
	7: Steps.Survey,
	8: Steps.ThankYou
}

export const canProgressFns = {
	0: (state: SubmissionState) => true,
	1: (state: SubmissionState) => true,
	2: (state: SubmissionState) => true,
	3: (state: SubmissionState) => !!(state?.theme.length > 0),
	4: (state: SubmissionState) => !!(state?.emailVerified === true),
	5: (state: SubmissionState) => !!(state?.hasEnteredContent === true),
	6: (state: SubmissionState) => false,
	7: (state: SubmissionState) => false,
	8: (state: SubmissionState) => false
} as { [key: number]: (state: SubmissionState) => boolean }

export const canGoBackFns = {
	0: () => true,
	1: () => true,
	2: () => true,
	3: () => true,
	4: () => true,
	5: () => true,
	6: () => true,
	7: () => false,
	8: () => false
} as { [key: number]: () => boolean }

export const SubmissionPage: React.FC = () => {
	// state interaction
	const dispatch = useDispatch()
	const activeStep = useSelector(selectStep)
	const storyId = useSelector(selectId)
	const storyType = useSelector(selectType)
	const [unfinished, setUnfinished] = useState<boolean>(false)
	const handleCloseToast = () => setUnfinished(false)
	const handleBack = () => {
		typeof window !== undefined && window.scrollTo(0, 0)
		dispatch(decrementStep())
	}
	const handleNext = () => {
		typeof window !== undefined && window.scrollTo(0, 0)
		dispatch(incrementStep())
	}
	const handleReset = () => {
		dispatch(resetSubmission('video'))
		resetDatabase({})
		handleCloseToast()
	}

	// handle query params
	const router = useRouter()
	const { type } = router.query
	useEffect(() => {
		if (type && storyType !== type && typeof type === 'string') {
			dispatch(resetSubmission(type as SubmissionTypes))
		}
	}, [type])

	useEffect(() => {
		if (activeStep !== 0) {
			setUnfinished(true)
		}
	}, [])

	const dbActive = typeof db
	const handleCacheStory = (content: string | Blob) => {
		if (typeof content === 'string' && !content.length) {
			console.log('No Content')
			return
		}
		if (typeof content !== 'string' && !content?.type.length) {
			console.log('No type')
			return
		}
		if (db) {
			db.submissions.update(0, { content })
		}
		dispatch(setHasEnteredContent())
	}

	const handleCacheAdditionalContent = (additionalContent: string | Blob) => {
		if (typeof additionalContent === 'string' && !additionalContent.length) {
			console.log('No Content')
			return
		}
		if (
			typeof additionalContent !== 'string' &&
			!additionalContent?.type.length
		) {
			console.log('No type')
			return
		}
		if (db) {
			db.submissions.update(0, { additionalContent })
		}
	}

	const handleRetrieveStory = () => {
		return ''
	}

	// handle cache story in dexie / indexedbd
	useEffect(() => {
		if (db && storyId.length) {
			db.submissions
				.get(0)
				.then((entry) => {
					if (!entry) {
						db.submissions.add({
							id: 0,
							storyId: storyId,
							type: storyType,
							content: '',
							additionalContent: '',
							completed: false
						})
					}
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}, [dbActive, storyId]) // eslint-disable-line

	useEffect(() => {
		if (db && storyId.length) {
			db.submissions
				.get(0)
				.then((entry) => {
					if (entry && entry.type && entry.type !== storyType) {
						db.submissions.update(0, {
							type: storyType,
							content: '',
							completed: false
						})
					}
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}, [storyType, storyId.length])

	// @ts-ignore
	const CurrentStepComponent = stepComponents[activeStep]
	return (
		<Box
			sx={{ minHeight: '100vh', margin: '1.5em auto' }}
			className="standard-page-width"
		>
			<CurrentStepComponent
				handleNext={handleNext}
				storyId={storyId}
				handleCacheStory={handleCacheStory}
				handleCacheAdditionalContent={handleCacheAdditionalContent}
				handleRetrieveStory={handleRetrieveStory}
				dbActive={dbActive}
			/>
			<SubmissionStepper
				steps={stepsText}
				activeStep={activeStep}
				handleBack={handleBack}
				handleNext={handleNext}
				handleReset={handleReset}
			/>
			<Snackbar
				open={unfinished}
				autoHideDuration={10000}
				onClose={handleCloseToast}
			>
				<Alert
					onClose={handleCloseToast}
					severity="warning"
					variant="outlined"
					sx={{ width: '100%', maxWidth: '400px', background: 'black' }}
				>
					You started a submission, but didn&apos;t finish it. This story is
					only saved to this device.
					<br />
					<br />
					You can finish submitting this story, or{' '}
					<Button
						onClick={handleReset}
						sx={{ padding: 0, textTransform: 'none' }}
					>
						click here to start over.
					</Button>
				</Alert>
			</Snackbar>
		</Box>
	)
}
