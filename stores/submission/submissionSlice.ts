import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SubmissionTypes = "av" | "written" | "photo" | "phone";
export interface SubmissionState {
  step: number;
  type: SubmissionTypes;
  theme: string;
  questions: string[];
  county: string;
  title: string;
  consent: boolean;
  optInResearch: boolean;
}

const initialState: SubmissionState = {
  step: 0,
  type: "av",
  theme: "",
  questions: [],
  county: "",
  title: "",
  consent: false,
  optInResearch: false,
};

export const submissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: {
    reset: (state) => {
      state = {
        ...initialState
      };
    },
    incrementStep: (state) => {
      state.step = state.step + 1;
    },
    decrementStep: (state) => {
      state.step = state.step - 1;
    },
    setType: (state, action: PayloadAction<SubmissionTypes>) => {
      state.type = action.payload;
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
      state.questions = [];
    },
    addQuestions: (state, action: PayloadAction<string>) => {
      state.questions.push(action.payload);
    },
    removeQuestions: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((q) => q !== action.payload);
    },
    setCounty: (state, action: PayloadAction<string>) => {
      state.county = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    toggleConsent: (state) => {
      state.consent = !state.consent;
    },
    toggleOptInResearch: (state) => {
      state.optInResearch = !state.optInResearch;
    },
  },
});

// Action creators are generated for each case reducer function
export const actions = submissionSlice.actions;
export default submissionSlice.reducer;

interface SubmissionStateOuter {
  submission: SubmissionState;
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
};
