import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const PreviewVid = styled.video`
	width: 100%;
	aspect-ratio: 1.78;
`
const PreviewCanvas = styled.canvas`
	margin: 0 auto;
	display: block;
`

interface MediaPreviewProps {
	stream: MediaStream | null
}
interface MediaRef {
    srcObject: any
}
export const VideoPreview: React.FC<MediaPreviewProps> = ({ stream }) => {
	const videoRef = useRef<MediaRef>(null)
	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream
		}
	}, [stream])
	if (!stream) {
		return null
	}
    // @ts-ignore
	return <PreviewVid ref={videoRef} autoPlay playsInline />
}

export const AudioPreview: React.FC<MediaPreviewProps> = ({ stream }) => {
	const canvasRef = useRef(null)
	const [visualDrawTimer, setVisualDrawTimer] = useState(null)

	const visualize = async (stream: MediaStream) => {
		//@ts-ignore
		const WIDTH = canvasRef?.current.width
		//@ts-ignore
		const HEIGHT = canvasRef?.current.height
		//@ts-ignore
		const ctx = canvasRef?.current.getContext('2d')
		//@ts-ignore
		var audioContext = new (window.AudioContext || window.webkitAudioContext)()
		var analyser = audioContext.createAnalyser()
		var dataArray = new Uint8Array(analyser.frequencyBinCount)

		if (stream instanceof Blob) {
			const arrayBuffer = await new Response(stream).arrayBuffer()
			const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
			//@ts-ignore
			source = audioContext.createBufferSource()
			//@ts-ignore
			source.buffer = audioBuffer
			source.connect(analyser)
			//@ts-ignore
			source.start(0)
		} else {
			var source = audioContext.createMediaStreamSource(stream)
			source.connect(analyser)
		}

		analyser.fftSize = 1024
		var bufferLength = analyser.fftSize
		var dataArray = new Uint8Array(bufferLength)

		ctx.clearRect(0, 0, WIDTH, HEIGHT)
		var draw = () => {
			//@ts-ignore
			setVisualDrawTimer(requestAnimationFrame(draw))
			analyser.getByteTimeDomainData(dataArray)
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, WIDTH, HEIGHT)
			ctx.lineWidth = 1
			ctx.strokeStyle = 'black'
			ctx.beginPath()

			var sliceWidth = (WIDTH * 1.0) / bufferLength
			var x = 0

			for (var i = 0; i < bufferLength; i++) {
				var v = dataArray[i] / 128.0
				var y = (v * HEIGHT) / 2

				if (i === 0) {
					ctx.moveTo(x, y)
				} else {
					ctx.lineTo(x, y)
				}

				x += sliceWidth
			}

			ctx.lineTo(WIDTH, HEIGHT / 2)
			ctx.stroke()
		}
		draw()
	}

	useEffect(() => {
		if (canvasRef.current && stream) {
			visualize(stream)
		}
	}, [stream])
	if (!stream) {
		return null
	}
	return <PreviewCanvas ref={canvasRef} width="100%" height="50px" />
}
