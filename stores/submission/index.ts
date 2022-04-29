import { store, persistor } from "../store";
import {
    selectors,
    actions,
} from "./submissionSlice";

const {    
  resetSubmission,
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
   
  resetSubmission,
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
