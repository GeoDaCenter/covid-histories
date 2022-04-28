import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SurveyState {
	userId: string
    selfIdentifiedRace: string
    selfIdentifiedRaceDescription: string
    perceivedIdentifiedRace: string
    perceivedIdentifiedRaceDescription: string
    genderIdentity: string
    age: number
    placeUrbanicity: string
    additionalDescription: string
}

const initialState: SurveyState = {
	userId: '',
    selfIdentifiedRace: '',
    selfIdentifiedRaceDescription: '',
    perceivedIdentifiedRace: '',
    perceivedIdentifiedRaceDescription: '',
    genderIdentity: '',
    age: 0,
    placeUrbanicity: '',
    additionalDescription: '',
}

export const surveySlice = createSlice({
	name: 'survey',
	initialState,
	reducers: {
		resetSurvey: (state) => {
			state = {
				...initialState
			}
		},
        setTextProperty: (state, action: PayloadAction<{field: string, value: string}>) => {
            // @ts-ignore
            state[action.payload.field] = action.payload.value
        },
        setAge: (state, action: PayloadAction<number>) => {
            state.age = action.payload
        }
	}
})

// Action creators are generated for each case reducer function
export const actions = surveySlice.actions
export default surveySlice.reducer

interface SurveyStateOuter {
	survey: SurveyState
}

export const selectors = {
    selectUserId: (state: SurveyStateOuter) => state.survey.userId,
    selectSelfIdentifiedRace: (state: SurveyStateOuter) => state.survey.selfIdentifiedRace,
    selectSelfIdentifiedRaceDescription: (state: SurveyStateOuter) => state.survey.selfIdentifiedRaceDescription,
    selectPerceivedIdentifiedRace: (state: SurveyStateOuter) => state.survey.perceivedIdentifiedRace,
    selectPerceivedIdentifiedRaceDescription: (state: SurveyStateOuter) => state.survey.perceivedIdentifiedRaceDescription,
    selectGenderIdentity: (state: SurveyStateOuter) => state.survey.genderIdentity,
    selectAge: (state: SurveyStateOuter) => state.survey.age,
    selectPlaceUrbanicity: (state: SurveyStateOuter) => state.survey.placeUrbanicity,
    selectAdditionalDescription: (state: SurveyStateOuter) => state.survey.additionalDescription,
}
