import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleAudioVideo } from '../../../stores/submission'
import { selectType } from '../../../stores/submission'
import { db } from '../../../stores/indexdb/db'
// @ts-ignore

import dynamic from 'next/dynamic'
import { Alert, Box, Button, Grid, Typography } from '@mui/material'
import styled from 'styled-components'
import colors from '../../../config/colors'
import { StoryInputProps } from './types'

import { useReactMediaRecorder } from 'react-media-recorder'
import { useGetMediaDevices } from '../../../hooks/useGetMediaDevices'
import { AdvancedSettingsModal } from './AvUtils/AdvancedSettingsModal'
import { AvSwitch } from './AvUtils/AvSwitch'
const Recorder = dynamic(() => import('./AvUtils/Recorder'), {
	loading: () => <p>...</p>,
	ssr: false
})

const RecorderContainer = styled.div`
	video {
		width: 100%;
		aspect-ratio: 1.78;
	}
`

const initialVideoConstraints: MediaTrackConstraints = {
	height: {
		min: 480,
		max: 1920,
		ideal: 1080
	},
	width: {
		min: 640,
		max: 1920,
		ideal: 1920
	},
	frameRate: 30
}

const initialAudioConstraints: MediaTrackConstraints = {
	sampleRate: {
		min: 22500,
		max: 96000,
		ideal: 48000
	},
	sampleSize: 16,
	channelCount: 2
}

export const AvSubmission: React.FC<StoryInputProps> = ({
	handleCacheStory,
	dbActive,
	storyId
}) => {
	const dispatch = useDispatch()
	const useVideo = useSelector(selectType) === 'video'
	const toggleUseVideo = () => dispatch(toggleAudioVideo())
	const [recordingTimeout, setRecordingTimeout] = useState(null)
	const [showAdvancedModal, setShowAdvancedModal] = useState<boolean>(false)
	const toggleAdvancedModal = () => setShowAdvancedModal(prev => !prev)
	const [cachedStory, setCachedStory] = useState<string>('')

	const [videoConstraints, setVideoConstraints] =
		useState<MediaTrackConstraints>(initialVideoConstraints)
	const [audioConstraints, setAudioConstraints] =
		useState<MediaTrackConstraints>(initialAudioConstraints)

	const handleAudioSource = (deviceId: string) => {
		setAudioConstraints({
			...initialAudioConstraints,
			deviceId
		})
	}
	const handleVideoSource = (deviceId: string) => {
		setVideoConstraints({
			...initialVideoConstraints,
			deviceId
		})
	}
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
		askPermissionOnMount: true,
		// mediaRecorderOptions: { 
		// 	mimeType: 'video/webm; codecs=vp9',
		// 	videoBitsPerSecond: 5000000,
		// 	audioBitsPerSecond: 128000,
		// 	bitsPerSecond: 5000000
		// }
	})

	const availableDevices = useGetMediaDevices({
		handleAudioSource,
		handleVideoSource,
		status
	})

	const hasRecorded =
		status !== 'recording' && (mediaBlobUrl !== null || cachedStory !== '')
	const mediaInUse = status === 'media_in_use'
	const MIMETYPE = useVideo ? 'video/mp4' : 'audio/wav'

	useEffect(() => {
		if (status === 'stopped' && mediaBlobUrl !== null) {
			console.log('mediaBlobUrl', mediaBlobUrl)
			const generateBlob = async () => {
				const data = await fetch(mediaBlobUrl).then((r) => r.blob())
				const blob = new Blob([data], { type: MIMETYPE })
				handleCacheStory(blob)
				setCachedStory('')
			}
			generateBlob()
		}
	}, [status]) // eslint-disable-line

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
			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					<Typography>
						We know getting in front of a camera or recording your voice can be intimidating. 
						Take some deep breaths before you hit record and imagine you are talking to a family member or friend.  
						Here are some tips to help you share your story:
					</Typography>
					<br />
						{useVideo && (
							<Typography>
								Video tips:
								<ul>
									<li>Try to record in an area with good lighting &amp; minimal background noise</li>
									<li>Raise your camera to eye-level. You can use a stack of books or other sturdy objects to lift up your device</li>
									<li>If you are using your phone or handheld device, make sure to set your camera on a sturdy surface or use a tripod if you have one </li>
									<li>Look directly into the camera. Imagine you are talking to a good friend</li>
								</ul> 
							</Typography>
						)}
						
						<Typography>
							Audio tips:
							<ul>
								<li>Listen to the room, and try to find a quiet area</li>
								<li>Avoid distracting noises, like other people talking, clothes or jewelry rustling, or chip bags crackling</li>
								<li>Place your device on a steady surface, and try not to move it too much</li>
							</ul>
							</Typography>
					{hasRecorded && (
						<Alert severity="success" sx={{my: 2}}>
							Your story has been recorded! You can review your recording on
							this page, and when you are happy with it please proceed to the
							next step.
						</Alert>
					)}
					{mediaInUse && (
						<p>
							We weren{"'"}t able to access your camera and microphone. This
							happens most often with another program using your camera, such as
							video chats. Please make sure no other applications are using your
							camera and microphone.
						</p>
					)}
				</Grid>
				<Grid item xs={12} md={6}>
					<Box sx={{ padding: '1em', marginBottom: '1em', background: colors.darkgray, border: `1px solid ${colors.gray}` }}>
					<Grid container spacing={2} alignItems="center" alignContent="center">
						<Grid item xs={8}>
							<AvSwitch useVideo={useVideo} toggleUseVideo={toggleUseVideo} />
						</Grid>
						<Grid item xs={4}>
							<Button variant="outlined" onClick={toggleAdvancedModal}>Advanced Settings</Button>
						</Grid>
					</Grid>
					</Box>
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
			<AdvancedSettingsModal
				open={showAdvancedModal}
				handleClose={toggleAdvancedModal}
				availableDevices={availableDevices}
				handleAudioSource={handleAudioSource}
				handleVideoSource={handleVideoSource}
				videoConstraints={videoConstraints}
				audioConstraints={audioConstraints}
			/>
		</RecorderContainer>
	)
}
