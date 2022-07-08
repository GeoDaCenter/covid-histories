import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RaceDescription {
    name: string
    description: string
}
export interface SurveyState {
	userId: string
    selfIdentifiedRace: RaceDescription[]
    perceivedIdentifiedRace: RaceDescription[]
    genderIdentity: string
    age: number
    placeUrbanicity: string
    additionalDescription: string
}

const initialState: SurveyState = {
	userId: '',
    selfIdentifiedRace: [],
    perceivedIdentifiedRace: [],
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
        toggleRace: (state, action: PayloadAction<{name: string, type: 'selfIdentifiedRace' | 'perceivedIdentifiedRace'}>) => {
            const type = action.payload.type
            const name = action.payload.name
            const alreadyPresent = state[type].find(f => f.name === name)
            if (alreadyPresent) {
                state[type] = state[type].filter(f => f.name !== name)
            } else {
                state[type] = [
                    ...state[type],
                    {
                        name,
                        description: ''
                    }
                ]
            }
        },
        setRaceDescription: (state, action: PayloadAction<{name: string, description: string, type: 'selfIdentifiedRace' | 'perceivedIdentifiedRace'}>) => {
            const type = action.payload.type
            const name = action.payload.name
            const description = action.payload.description
            state[type] = state[type].map(f => {
                if (f.name === name) {
                    return {
                        ...f,
                        description
                    }
                }
                return f
            })
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
    selectPerceivedIdentifiedRace: (state: SurveyStateOuter) => state.survey.perceivedIdentifiedRace,
    selectGenderIdentity: (state: SurveyStateOuter) => state.survey.genderIdentity,
    selectAge: (state: SurveyStateOuter) => state.survey.age,
    selectPlaceUrbanicity: (state: SurveyStateOuter) => state.survey.placeUrbanicity,
    selectAdditionalDescription: (state: SurveyStateOuter) => state.survey.additionalDescription,
}
