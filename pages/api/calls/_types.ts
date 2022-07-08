export interface TopicResponse {
  topic: string
  responseAudioUrl: string
  responseTranscriptUrl?: string
  createdAt: Date
  duration: number
}

export interface UserCallRecord {
  zipCode?: string
  responses: Array<TopicResponse>
  numberHash: string
  createdAt: Date
  language: 'en' | 'es'
}
