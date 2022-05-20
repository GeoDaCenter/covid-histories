import React, { useState, useEffect, useRef } from 'react'
import Timer from './Timer'
import styled from 'styled-components'
import { AudioPreview, VideoPreview } from './MediaPreviews'
import { Alert, Button, Grid } from '@mui/material'
import colors from '../../../../config/colors'

const AudioVideoContainer = styled.div`
	width: 100%;
	position: relative;
`

const AudioPreviewContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
`

const RecordingLight = styled.div<{ active: boolean }>`
	display: inline-block;
	border-radius: 0.375rem;
	width: 0.75rem;
	height: 0.75rem;
	background: ${(props) => (props.active ? 'red' : 'black')};
	margin-right: 0.5em;
`

interface RecordingButtonProps {
	status: string
	stopRecording: () => void
	startRecording: () => void
}

const RecordingButton: React.FC<RecordingButtonProps> = ({
	status,
	stopRecording,
	startRecording
}) => {
	const handleClick = status === 'recording' ? stopRecording : startRecording
	const actionText =
		status === 'recording' ? 'Stop Recording' : 'Start Recording'
	return (
		<Button
			onClick={handleClick}
			sx={{
				background: status === 'recording' ? colors.darkgray : 'lime',
				color: status === 'recording' ? colors.white : 'black',
				borderWidth: 1,
				borderColor: status === 'recording' ? colors.red : 'black',
				borderStyle: 'solid',
				textTransform: 'none',
				'&:hover': {
					background: colors.orange
				}
			}}
		>
			<RecordingLight active={status === 'recording'} />
			{actionText}
		</Button>
	)
}
interface RecorderProps {
	useVideo: boolean
	status: string
	startRecording: () => void
	stopRecording: () => void
	mediaBlobUrl: string | null
	previewStream: MediaStream | null
	previewAudioStream: MediaStream | null
	length: number
	hasRecorded: boolean
	cachedStory: string
}
const Recorder: React.FC<RecorderProps> = ({
	useVideo,
	status,
	startRecording,
	stopRecording,
	mediaBlobUrl,
	previewStream,
	previewAudioStream,
	length,
	hasRecorded,
	cachedStory
}) => {
	const mediaUrl = cachedStory ? cachedStory : mediaBlobUrl
	return useVideo ? (
		<>
			{hasRecorded ? (
				//@ts-ignore
				<video src={mediaUrl} controls playsInline />
			) : (
				<AudioVideoContainer>
					{/* @ts-ignore */}
					<VideoPreview stream={previewStream} playsInline />
					<AudioPreviewContainer>
						<AudioPreview stream={previewAudioStream} />
					</AudioPreviewContainer>
				</AudioVideoContainer>
			)}
			<Grid container spacing={1} alignItems="center" alignContent="center">
				<Grid item xs={12}>
					{hasRecorded ? (
						<Alert severity="warning">
							Warning: Recording a new story will delete your previous draft!
						</Alert>
					) : null}
				</Grid>
				<Grid item xs={12} md={6}>
					<RecordingButton
						startRecording={startRecording}
						stopRecording={stopRecording}
						status={status}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<Timer {...{ status, length }} />
				</Grid>
			</Grid>
		</>
	) : (
		<>
			<Grid container spacing={1} alignItems="center" alignContent="center">
				<Grid item xs={12}>
					{hasRecorded ? (
						<Alert severity="warning">
							Warning: Recording a new story will delete your previous draft!
						</Alert>
					) : null}
				</Grid>
				<Grid item xs={12} md={4}>
					<RecordingButton
						startRecording={startRecording}
						stopRecording={stopRecording}
						status={status}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					{hasRecorded ? (
						<audio controls>
							{/* @ts-ignore */}
							<source src={mediaUrl} />
							Your browser does not support the audio element.
						</audio>
					) : (
						<AudioPreview stream={previewAudioStream} />
					)}
				</Grid>
				<Grid item xs={12} md={2}>
					<Timer {...{ status, length }} />
				</Grid>
			</Grid>
		</>
	)
}

export default Recorder
