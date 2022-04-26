import { store, persistor } from "./store";
import {
    selectors,
    actions,
} from "./submissionSlice";

const {    
  reset,
  incrementStep,
  decrementStep,
  setType,
  setTheme,
  addQuestions,
  removeQuestions,
  setCounty,
  setTitle,
  toggleConsent,
  toggleOptInResearch,
} = actions;

const {
    selectStep,
    selectType,
    selectTheme,
    selectQuestions,
    selectCounty,
    selectTitle,
    selectConsent,
    selectOptInResearch,
    selectId
} = selectors;

export {
  store, 
  persistor,
   
  reset,
  incrementStep,
  decrementStep,
  setType,
  setTheme,
  addQuestions,
  removeQuestions,
  setCounty,
  setTitle,
  toggleConsent,
  toggleOptInResearch,

  selectStep,
  selectType,
  selectTheme,
  selectQuestions,
  selectCounty,
  selectTitle,
  selectConsent,
  selectOptInResearch,
  selectId
};
