import React from "react";
import { store, persistor } from "../stores/submission";
import { Provider } from "react-redux";
import SubmissionApp from "../components/Submission/index";
import { PersistGate } from 'redux-persist/integration/react'

export default function Submit() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SubmissionApp />
      </PersistGate>
    </Provider>
  );
}
