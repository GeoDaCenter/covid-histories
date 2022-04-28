import { store, persistor } from "../store";
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
  toggleAudioVideo,
  toggleOptInResearch,
  toggleIsUploading,
  setUploadProgress
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
    selectId,
    selectIsUploading,
    selectUploadProgress
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
  toggleAudioVideo,
  toggleOptInResearch,
  toggleIsUploading,
  setUploadProgress,

  selectStep,
  selectType,
  selectTheme,
  selectQuestions,
  selectCounty,
  selectTitle,
  selectConsent,
  selectOptInResearch,
  selectId,
  selectIsUploading,
  selectUploadProgress
};
