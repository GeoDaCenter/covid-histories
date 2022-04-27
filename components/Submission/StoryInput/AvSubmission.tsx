import React, { useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import dynamic from 'next/dynamic'
import { StoryInputProps } from './types'
const Recorder = dynamic(() => import('./AvUtils/Recorder'), {
	loading: () => <p>...</p>,
	ssr: false
})

const videoConstraints: MediaTrackConstraints = {
	height: {
		min: 480,
		max: 1920,
		ideal: 1080
	},
	width: {
		min: 640,
		max: 1920,
		ideal: 1920
	}
}

const audioConstraints: MediaTrackConstraints = {
	// sampleRate: {
	//   min: 22500,
	//   max: 96000,
	//   ideal: 48000,
	// },
}

export const AvSubmission: React.FC<StoryInputProps> = ({
	submissionType
}) => {
	const [useVideo, setUseVideo] = useState(true)
	const [recordingTimeout, setRecordingTimeout] = useState(null)

	const {
		status,
		startRecording,
		stopRecording,
		mediaBlobUrl,
		previewStream,
		previewAudioStream
	} = useReactMediaRecorder({
		video: useVideo ? videoConstraints : false,
		audio: audioConstraints,
		askPermissionOnMount: true
	})

	return (
		<div>
			<h2>Record your story</h2>
			<Recorder
				{...{
					length,
					useVideo,
					status,
					startRecording,
					stopRecording,
					mediaBlobUrl,
					previewStream,
					previewAudioStream
				}}
			/>
		</div>
	)
}
