export interface StepComponentProps {
	step?: number
	handleNext: () => void
	handleBack: () => void
	handleReset: () => void
	handleCacheStory: (content: any) => void
	handleCacheAdditionalContent: (content: any) => void
	handleRetrieveStory: () => string
	storyId: string
	dbActive: any
}
