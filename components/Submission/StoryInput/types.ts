import { SubmissionTypes } from '../../../stores/submission/submissionSlice'

export interface StoryInputProps {
  handleCacheStory: (content: any) => void
  handleCacheAdditionalContent: (content: any) => void
  handleLoadStateContent?: (content: any) => void
  handleRetrieveStory?: () => string
  handleNext?: () => void
  storyId?: string
  dbActive?: any
  submissionType?: SubmissionTypes
  isAdditionalContent?: boolean
}
