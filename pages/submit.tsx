import React from 'react'
import { store, persistor } from '../stores/submission'
import { Provider } from 'react-redux'
import SubmissionApp from '../components/Submission/index'
import { PersistGate } from 'redux-persist/integration/react'
import Head from 'next/head'
import { SEO } from '../components/Interface/SEO'

export default function Submit() {
	return (
		<div style={{ padding: '0 1em' }}>
			<SEO title="Atlas Stories :: Submit" />
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<SubmissionApp />
				</PersistGate>
			</Provider>
		</div>
	)
}
