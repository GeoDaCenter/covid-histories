export interface FileListReturn {
	Contents: Array<{
		Key: string
		LastModified: string
	}>
}
export type SubmissionType = 'audio' | 'video' | 'written' | 'photo'
export interface QueryParams {
	fileType: string
	storyId: string
	storyType: SubmissionType
}
