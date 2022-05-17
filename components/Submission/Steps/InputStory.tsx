import { Grid, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectType } from '../../../stores/submission'
import * as StoryInput from '../StoryInput'
import { StoryInputProps } from '../StoryInput/types'
import { StepComponentProps } from './types'

const inputComponentMap: { [key: string]: React.FC<StoryInputProps> } = {
	written: StoryInput.WrittenSubmission,
	audio: StoryInput.AvSubmission,
	video: StoryInput.AvSubmission,
	photo: StoryInput.PhotoSubmission
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
		<Grid container spacing={2} minHeight="75vh" alignContent="center" justifyContent="center" >
			<Grid item xs={12}>
				<Typography variant="h2">Make your story</Typography>
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
