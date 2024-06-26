import { Grid, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectType } from '../../../stores/submission'
import { WrittenSubmission } from '../StoryInput/WrittenSubmission'
import { PhotoSubmission } from '../StoryInput/PhotoSubmission'
import { StoryInputProps } from '../StoryInput/types'
import { StepComponentProps } from './types'

const AvSubmission = dynamic(() => import('../StoryInput/AvSubmission'), {
	loading: () => <p>...</p>,
	ssr: false
})

const inputComponentMap: { [key: string]: React.FC<StoryInputProps> } = {
	written: WrittenSubmission,
	// @ts-ignore
	audio: AvSubmission,
	// @ts-ignore
	video: AvSubmission,
	photo: PhotoSubmission
}

export const InputStory: React.FC<StepComponentProps> = ({
	handleCacheStory,
	handleCacheAdditionalContent,
	handleRetrieveStory,
	storyId,
	dbActive
}) => {
	const submissionType = useSelector(selectType)
	const SubmissionComponent = inputComponentMap[submissionType]

	return (
		<Grid
			container
			spacing={2}
			minHeight="75vh"
			alignContent="start"
			justifyContent="center"
		>
			<Grid item xs={12}>
				<Typography variant="h2">Share your story</Typography>
				{submissionType === 'written' && (
					<>
						<Typography>
							Here are some tips to help you share your story:
						</Typography>
						<Typography>
							<ul>
								<li>
									Write from your senses and your experience; use concrete
									images, actions, moments, conversations. Put your listeners in
									the moment.
								</li>
								<li>
									Read your story to someone else, or read it aloud to yourself.
								</li>
								<li>Focus on the important details of your experiences.</li>
							</ul>
						</Typography>
					</>
				)}
			</Grid>
			<Grid item xs={12}>
				{SubmissionComponent !== undefined && (
					<SubmissionComponent
						submissionType={submissionType}
						handleCacheStory={handleCacheStory}
						handleCacheAdditionalContent={handleCacheAdditionalContent}
						handleRetrieveStory={handleRetrieveStory}
						storyId={storyId}
						dbActive={dbActive}
					/>
				)}
			</Grid>
		</Grid>
	)
}
