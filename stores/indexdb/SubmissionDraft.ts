import { SubmissionTypes } from '../submission/submissionSlice'

export interface SubmissionDraft {
	id?: number
	storyId: string
	type: SubmissionTypes
	content: string | Blob
	additionalContent: string
	completed: boolean
}
