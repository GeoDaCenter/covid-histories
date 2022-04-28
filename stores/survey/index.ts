import { store, persistor } from '../store'
import { selectors, actions } from './surveySlice'

const { resetSurvey, setTextProperty, setAge } = actions

const {
	selectUserId,
	selectSelfIdentifiedRace,
	selectSelfIdentifiedRaceDescription,
	selectPerceivedIdentifiedRace,
	selectPerceivedIdentifiedRaceDescription,
	selectGenderIdentity,
	selectAge,
	selectPlaceUrbanicity,
	selectAdditionalDescription
} = selectors

export {
	resetSurvey,
	setTextProperty,
	setAge,
	selectUserId,
	selectSelfIdentifiedRace,
	selectSelfIdentifiedRaceDescription,
	selectPerceivedIdentifiedRace,
	selectPerceivedIdentifiedRaceDescription,
	selectGenderIdentity,
	selectAge,
	selectPlaceUrbanicity,
	selectAdditionalDescription
}
