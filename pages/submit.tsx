import React from "react";
import { store, persistor } from "../stores/submission";
import { Provider } from "react-redux";
import SubmissionApp from "../components/Submission/index";
import { PersistGate } from 'redux-persist/integration/react'
import Head from "next/head";

export default function Submit() {
  return (
    <div style={{padding:'0 1em'}}>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Sriracha&display=swap"
        />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SubmissionApp />
        </PersistGate>
      </Provider></div>
  );
}
