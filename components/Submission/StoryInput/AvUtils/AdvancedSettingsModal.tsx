import React from 'react'
import {
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    Grid,
    Typography,
    Button,
    Box,
    Modal
} from '@mui/material';
import colors from '../../../../config/colors';
import { MediaDevices } from '../../../../hooks/useGetMediaDevices';

interface AdvancedModalProps {
	availableDevices: MediaDevices
	handleVideoSource: (device: string) => void
	handleAudioSource: (device: string) => void
	videoConstraints: MediaTrackConstraints
	audioConstraints: MediaTrackConstraints
	open: boolean
	handleClose: () => void
}

const advancedModalStyle = {
	width: 'clamp(300px, 600px, 90vw)',
	position: 'relative',
	left: '50%',
	top: '50%',
	transform: 'translate(-50%,-50%)',
	background: colors.darkgray,
	padding: '2em',
}

export const AdvancedSettingsModal: React.FC<AdvancedModalProps> = ({
	videoConstraints,
	audioConstraints,
	handleVideoSource,
	handleAudioSource,
	availableDevices,
	open,
	handleClose
}) => {
	const videoSource = availableDevices.video.find(f => f.deviceId === videoConstraints.deviceId)
	const audioSource = availableDevices.video.find(f => f.deviceId === audioConstraints.deviceId)

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="advanced-modal-title"
			aria-describedby="advanced-modal-description"
		>
			<Box sx={advancedModalStyle}>
				<Typography id="advanced-modal-title" variant="h6">
					Advanced Settings
				</Typography>
				<Typography id="advanced-modal-description" variant="subtitle1">
					Adjust the settings below to your liking.
				</Typography>

				<Grid container spacing={1}>
					<Grid item xs={12} md={6}>
						<FormControl size="small" fullWidth sx={{ margin: '1em 0' }}>
							<InputLabel id="video-select-small">Select Video Source</InputLabel>
							<Select
								labelId="video-select-small"
								id="video-select-small"
								value={videoSource}
								label="Video Input"
								// @ts-ignore
								onChange={(e) => handleVideoSource(e.target.value)}
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
						<FormControl size="small" fullWidth sx={{ margin: '1em 0' }}>
							<InputLabel id="audio-select-small">Select Audio Source</InputLabel>
							<Select
								labelId="audio-select-small"
								id="audio-select-small"
								value={audioSource}
								label="Audio Input"
								// @ts-ignore
								onChange={(e) => handleAudioSource(e.target.value)}
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
				<Button variant="text" color="primary" onClick={handleClose} sx={{ position: 'absolute', top: '.5em', right: '.5em', fontWeight:"bold" }}>
					&times;
				</Button>
			</Box>
		</Modal>
	)
}