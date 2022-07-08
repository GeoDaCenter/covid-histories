export interface FileListReturn {
  Contents: Array<{
    Key: string
    LastModified: string
  }>
}
export type SubmissionType = 'av' | 'written' | 'photo'
export interface QueryParams {
  fileType: string
  storyId: string
  storyType: SubmissionType
}
