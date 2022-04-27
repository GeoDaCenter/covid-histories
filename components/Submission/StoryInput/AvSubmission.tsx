import React, { useEffect, useState, useRef } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { StoryInputProps } from './types'
import { Grid } from '@mui/material'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Switch from '@mui/material/Switch'
import Link from 'next/link'
import { db } from "../../../stores/indexdb/db";
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

const RecorderContainer = styled.div`
	video {
		width: 100%;
		aspect-ratio: 1.78;
	}
`
const AvSwitch: React.FC<{ useVideo: boolean; toggleUseVideo: () => void }> = ({
	useVideo,
	toggleUseVideo
}) => {
	return (
		<FormControl component="fieldset" variant="standard">
			<FormLabel component="legend">Record video and audio?</FormLabel>
			<FormGroup>
				<FormControlLabel
					control={
						<Switch checked={useVideo} onChange={toggleUseVideo} name="gilad" />
					}
					label={useVideo ? 'Record Video' : 'Record Audio Only'}
				/>
			</FormGroup>
			<FormHelperText>
				For more info, see our <Link href="/privacy"><a target="_blank" rel="noreferrer" style={{textDecoration:"underline"}}>Privacy Policy</a></Link>
			</FormHelperText>
		</FormControl>
	)
}

export const AvSubmission: React.FC<StoryInputProps> = ({ handleCacheStory, dbActive, storyId }) => {
	const [useVideo, setUseVideo] = useState(true)
	const toggleUseVideo = () => setUseVideo(prev => !prev)
	const [recordingTimeout, setRecordingTimeout] = useState(null)
	const [cachedStory, setCachedStory] = useState<string>('')
	// const cachedRef = useRef<string>('')
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
	const hasRecorded = status !== 'recording' && (mediaBlobUrl !== null || cachedStory !== '') 
	const mediaInUse = status === 'media_in_use'
	const MIMETYPE = useVideo
		? 'video/mp4'
		: 'audio/wav'
		
	useEffect(() => {
		if (status === 'stopped' && mediaBlobUrl !== null){
			const generateBlob = async () => {
				const data = await fetch(mediaBlobUrl).then(r => r.blob())
				const blob = new Blob([data], { type: MIMETYPE })
				handleCacheStory(blob)
				setCachedStory('')
			}
			generateBlob()
		}
	},[status]) // eslint-disable-line

	useEffect(() => {
		if (db && storyId?.length) {
			db.submissions.get(0).then((entry) => {
				if (entry?.content) {
					// @ts-ignore
					const blobUrl = URL.createObjectURL(entry.content)
					setCachedStory(blobUrl)
				}
			})
		}
	}, [dbActive, storyId])

	return (
		<RecorderContainer>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					{!hasRecorded && <p>Welcome! Getting started instructions...</p>}
					<AvSwitch useVideo={useVideo} toggleUseVideo={toggleUseVideo} />
					{hasRecorded && (
						<p>
							Your story has been recorded! You can review your recording on
							this page, and when you are happy with it please proceed to the
							next step.
							<br />
							<br />
							<b>Re-recording your story will delete your last draft.</b>
						</p>
					)}
					{mediaInUse && (
						<p>
							We weren{"'"}t able to access your camera and microphone. This happens
							most often with another program using your camera, such as video
							chats. Please make sure no other applications are using your
							camera and microphone.
						</p>
					)}
				</Grid>
				<Grid item xs={12} md={6}>
					<Recorder
						{...{
							length,
							useVideo,
							status,
							startRecording,
							stopRecording,
							previewStream,
							previewAudioStream,
							hasRecorded,
							mediaBlobUrl,
							cachedStory
						}}
					/>
				</Grid>
			</Grid>
		</RecorderContainer>
	)
}
