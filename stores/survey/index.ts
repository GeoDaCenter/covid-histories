import { store, persistor } from '../store'
import { selectors, actions } from './surveySlice'

const { resetSurvey, setTextProperty, setAge, toggleRace, setRaceDescription } =
  actions

const {
  selectUserId,
  selectSelfIdentifiedRace,
  selectPerceivedIdentifiedRace,
  selectGenderIdentity,
  selectAge,
  selectPlaceUrbanicity,
  selectAdditionalDescription
} = selectors

export {
  resetSurvey,
  setTextProperty,
  setAge,
  toggleRace,
  setRaceDescription,
  selectUserId,
  selectSelfIdentifiedRace,
  selectPerceivedIdentifiedRace,
  selectGenderIdentity,
  selectAge,
  selectPlaceUrbanicity,
  selectAdditionalDescription
}
