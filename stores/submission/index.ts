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
  setUploadProgress,
  setTags,
  setEmailVerified,
  setHasEnteredContent
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
    selectUploadProgress,
    selectTags,
    selectCanProgress,
    selectCanGoBack
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
  setTags,
  setEmailVerified,
  setHasEnteredContent,

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
  selectUploadProgress,
  selectTags,
  selectCanProgress,
  selectCanGoBack
};
