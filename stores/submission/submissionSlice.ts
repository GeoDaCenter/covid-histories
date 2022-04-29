import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'
export type SubmissionTypes = 'audio' | 'video' | 'written' | 'photo' | 'phone'
export interface SubmissionState {
	step: number
	type: SubmissionTypes
	theme: string
	questions: string[]
	county: { label: string; value: number }
	title: string
	consent: boolean
	optInResearch: boolean
	id: string
	isUploading: boolean
	uploadProgress: number
}

const initialState: SubmissionState = {
	step: 0,
	type: 'video',
	theme: '',
	questions: [],
	county: { label: '', value: 0 },
	title: '',
	id: nanoid(),
	consent: false,
	optInResearch: false,
	isUploading: false,
	uploadProgress: 0
}

export const submissionSlice = createSlice({
	name: 'submission',
	initialState,
	reducers: {
		resetSubmission: (state) => {
			state.step = 0,
			state.type = 'video',
			state.theme = '',
			state.questions = [],
			state.county = { label: '', value: 0 },
			state.title = '',
			state.consent = false,
			state.optInResearch = false,
			state.isUploading = false,
			state.uploadProgress = 0,
			state.id = nanoid()
		},
		incrementStep: (state) => {
			state.step = state.step + 1
		},
		decrementStep: (state) => {
			state.step = state.step - 1
		},
		setType: (state, action: PayloadAction<SubmissionTypes>) => {
			state.type = action.payload
			state.id = state.id === '' ? nanoid() : state.id
		},
		toggleAudioVideo: (state) => {
			state.type = state.type === 'video' ? 'audio' : 'video'
		},
		setTheme: (state, action: PayloadAction<string>) => {
			state.theme = action.payload
			state.questions = []
		},
		generateId: (state) => {
			state.id = nanoid()
		},
		addQuestions: (state, action: PayloadAction<string>) => {
			state.questions.push(action.payload)
		},
		removeQuestions: (state, action: PayloadAction<string>) => {
			state.questions = state.questions.filter((q) => q !== action.payload)
		},
		setCounty: (
			state,
			action: PayloadAction<{ label: string; value: number }>
		) => {
			state.county = action.payload
		},
		setTitle: (state, action: PayloadAction<string>) => {
			state.title = action.payload
		},
		toggleConsent: (state) => {
			state.consent = !state.consent
		},
		toggleOptInResearch: (state) => {
			state.optInResearch = !state.optInResearch
		},
		toggleIsUploading: (state) => {
			state.isUploading = !state.isUploading
		},
		setUploadProgress: (state, action: PayloadAction<number>) => {
			state.uploadProgress = action.payload
		}
	}
})

// Action creators are generated for each case reducer function
export const actions = submissionSlice.actions
export default submissionSlice.reducer

interface SubmissionStateOuter {
	submission: SubmissionState
}

export const selectors = {
	selectStep: (state: SubmissionStateOuter) => state.submission.step,
	selectType: (state: SubmissionStateOuter) => state.submission.type,
	selectTheme: (state: SubmissionStateOuter) => state.submission.theme,
	selectQuestions: (state: SubmissionStateOuter) => state.submission.questions,
	selectCounty: (state: SubmissionStateOuter) => state.submission.county,
	selectTitle: (state: SubmissionStateOuter) => state.submission.title,
	selectConsent: (state: SubmissionStateOuter) => state.submission.consent,
	selectOptInResearch: (state: SubmissionStateOuter) =>
		state.submission.optInResearch,
	selectId: (state: SubmissionStateOuter) => state.submission.id,
	selectIsUploading: (state: SubmissionStateOuter) =>
		state.submission.isUploading,
	selectUploadProgress: (state: SubmissionStateOuter) =>
		state.submission.uploadProgress
}
