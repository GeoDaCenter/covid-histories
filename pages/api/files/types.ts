export interface FileListReturn {
	Contents: Array<{
		Key: string
		LastModified: string
	}>
}

export interface QueryParams {
	type: SubmissionType
	fileType: string
	key: string
}

export  type SubmissionType = 'audio' | 'video' | 'written' | 'photo' | 'meta' | ''