import React from 'react'
import { StoryInputProps } from './types'
import { PhotoLoader } from './PhotoUtils.tsx/PhotoLoader'
import { WrittenSubmission } from './WrittenSubmission'
import { Grid, Typography } from '@mui/material'
import { SubmissionDraft } from '../../../stores/indexdb/SubmissionDraft'

export const PhotoSubmission: React.FC<StoryInputProps> = ({
	handleCacheStory,
	handleCacheAdditionalContent,
	storyId,
	dbActive
}) => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={6}>
				<Typography variant="h6" sx={{ marginBottom: '1em' }}>
					Upload a photo of your story.
				</Typography>
				<Typography>
					Here are some tips to help you share your story:
					<ul>
						<li>
							Choose an image that clearly tells your story. Try to find one
							with good lighting and is in focus.
						</li>
						<li>
							Jpg, png, gif, bmp, tif, heic, webp, and pdf and are all accepted
							file types.
						</li>
						<li>Your file size should be under 5MB.</li>
					</ul>
				</Typography>
				<PhotoLoader
					handleCacheStory={handleCacheStory}
					storyId={storyId}
					getCachedEntry={(entry: SubmissionDraft | undefined) => entry?.content}
					dbActive={dbActive}
				/>
			</Grid>
			<Grid item xs={12} md={6}>
				<Typography variant="h6" sx={{ marginBottom: '1em' }}>
					(Optional) Provide a caption or description for your photo.
				</Typography>
				<WrittenSubmission
					handleCacheStory={handleCacheAdditionalContent}
					handleCacheAdditionalContent={() => {}}
					storyId={storyId}
					dbActive={dbActive}
					isAdditionalContent={true}
				/>
			</Grid>
		</Grid>
	)
}
