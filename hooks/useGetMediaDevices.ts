import React, { useState, useEffect } from 'react'

export interface MediaDevices {
	video: MediaDeviceInfo[]
	audio: MediaDeviceInfo[]
}

interface useGetMediaProps {
	handleAudioSource: (device: string) => void
	handleVideoSource: (device: string) => void
	status: any
}

export const useGetMediaDevices = ({
	handleAudioSource,
	handleVideoSource,
	status
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
				handleVideoSource(defaultAudio.deviceId)
			}
			if (defaultAudio !== undefined && defaultAudio.deviceId !== undefined) {
				handleAudioSource(defaultAudio.deviceId)
			}

			setAvailableDevices({
				video,
				audio
			})
		}
		if (status === 'idle') {
			getMediaDevices()
		}
	}, [status])
	return availableDevices
}