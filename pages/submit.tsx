import React from "react";
import { store } from '../stores/submission'
import { Provider } from 'react-redux'
import SubmissionApp from '../components/Submission/index'

export default function Submit(){
    return <Provider store={store}>
        <SubmissionApp />
    </Provider>
}