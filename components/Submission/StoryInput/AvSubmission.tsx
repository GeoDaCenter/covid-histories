import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleAudioVideo } from '../../../stores/submission'
import { useReactMediaRecorder } from 'react-media-recorder'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { StoryInputProps } from './types'
import { Grid, InputLabel, MenuItem, Select } from '@mui/material'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Switch from '@mui/material/Switch'
import Link from 'next/link'
import { db } from '../../../stores/indexdb/db'
import { selectType } from '../../../stores/submission'
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
const AvSwitch: React.FC<{ useVideo: boolean; toggleUseVideo: () => void }> = ({
	useVideo,
	toggleUseVideo
}) => {
	return (
		<FormControl
			component="fieldset"
			variant="standard"
			sx={{ marginBottom: '2em' }}
		>
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
				For more info, see our{' '}
				<Link href="/privacy">
					<a
						target="_blank"
						rel="noreferrer"
						style={{ textDecoration: 'underline' }}
					>
						Privacy Policy
					</a>
				</Link>
			</FormHelperText>
		</FormControl>
	)
}
interface MediaDevices {
	video: MediaDeviceInfo[]
	audio: MediaDeviceInfo[]
}

interface useGetMediaProps {
	setVideoSource: (device: MediaDeviceInfo) => void
	setAudioSource: (device: MediaDeviceInfo) => void
}
const useGetMediaDevices = ({
	setVideoSource,
	setAudioSource
}: useGetMediaProps) => {
	const [availableDevices, setAvailableDevices] = useState<MediaDevices>({
		video: [],
		audio: []
	})
	useEffect(() => {
		const getMediaDevices = async () => {
			const devices = await navigator.mediaDevices.enumerateDevices()
			const video = devices.filter((f) => f.kind === 'videoinput')
			const audio = devices.filter((f) => f.kind === 'audioinput')
			const defaultVideo =
				video.find((f) => f.deviceId === 'default') || video[0]
			const defaultAudio =
				audio.find((f) => f.deviceId === 'default') || audio[0]
			if (defaultVideo !== undefined && defaultVideo.deviceId !== undefined) {
				setVideoSource(defaultVideo)
			}
			if (defaultAudio !== undefined && defaultAudio.deviceId !== undefined) {
				setAudioSource(defaultAudio)
			}

			setAvailableDevices({
				video,
				audio
			})
		}
		getMediaDevices()
	}, [])
	return availableDevices
}

interface DeviceSelectorProps {
	availableDevices: MediaDevices
	setVideoSource: (device: string) => void
	setAudioSource: (device: string) => void
	videoSource: MediaDeviceInfo
	audioSource: MediaDeviceInfo
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
	videoSource,
	audioSource,
	setVideoSource,
	setAudioSource,
	availableDevices
}) => {
	return (
		<Grid container spacing={1}>
			<Grid item xs={12} md={6}>
				<FormControl size="small" fullWidth sx={{ marginBottom: '1em' }}>
					<InputLabel id="video-select-small">Select Video Source</InputLabel>
					<Select
						labelId="video-select-small"
						id="video-select-small"
						value={videoSource}
						label="Video Input"
						// @ts-ignore
						onChange={(e) => setVideoSource(e.target.value)}
					>
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						{availableDevices.video.map((device, i) => (
							<MenuItem key={`video-${i}`} value={device.deviceId}>
								{device.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={6}>
				<FormControl size="small" fullWidth sx={{ marginBottom: '1em' }}>
					<InputLabel id="audio-select-small">Select Audio Source</InputLabel>
					<Select
						labelId="audio-select-small"
						id="audio-select-small"
						value={audioSource}
						label="Audio Input"
						// @ts-ignore
						onChange={(e) => setAudioSource(e.target.value)}
					>
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						{availableDevices.audio.map((device, i) => (
							<MenuItem key={`audio-${i}`} value={device.deviceId}>
								{device.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
		</Grid>
	)
}

const initialVideoConstraints: MediaStreamConstraints = {
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

const initialAudioConstraints: MediaStreamConstraints = {
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
	const [cachedStory, setCachedStory] = useState<string>('')

	const [videoConstraints, setVideoConstraints] =
		useState<MediaStreamConstraints>(initialVideoConstraints)
	const [audioConstrains, setAudioConstraints] =
		useState<MediaStreamConstraints>(initialAudioConstraints)

	const availableDevices = useGetMediaDevices({
		setVideoConstraints,
		setAudioConstraints,
		initialVideoConstraints,
		initialAudioConstraints
	})

	const handleAudioSource = (device: string) => {
		setAudioConstraints({
			...initialAudioConstraints,
			audioSource: { "exact": device }
		})
	}
	const handleVideoSource = (device: string) => {
		setVideoConstraints({
			...initialVideoConstraints,
			videoSource: { "exact": device }
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
		askPermissionOnMount: true
	})
	const hasRecorded =
		status !== 'recording' && (mediaBlobUrl !== null || cachedStory !== '')
	const mediaInUse = status === 'media_in_use'
	const MIMETYPE = useVideo ? 'video/mp4' : 'audio/wav'

	useEffect(() => {
		if (status === 'stopped' && mediaBlobUrl !== null) {
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
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<p>Welcome! Getting started instructions...</p>
					<AvSwitch useVideo={useVideo} toggleUseVideo={toggleUseVideo} />
					<p>
						If your video does not appear while recording, try changing your
						video input below. Same for sound.
					</p>
					<DeviceSelector
						availableDevices={availableDevices}
						// @ts-ignore
						handleVideoSource={handleVideoSource}
						// @ts-ignore
						handleAudioSource={handleAudioSource}
						videoSource={videoSource}
						audioSource={audioSource}
					/>
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
							We weren{"'"}t able to access your camera and microphone. This
							happens most often with another program using your camera, such as
							video chats. Please make sure no other applications are using your
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
