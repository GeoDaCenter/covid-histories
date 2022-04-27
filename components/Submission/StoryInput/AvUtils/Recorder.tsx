import React, { useState, useEffect, useRef } from 'react';
import Timer from './Timer';
import styled from 'styled-components';
import {
    AudioPreview,
    VideoPreview
} from './MediaPreviews'

const PreviewVid = styled.video`
  width:100%;
  aspect-ratio: 1.78;
`;

const RecordingButton = styled.button`
  font-size:1rem;
  background:rgba(0,200,50,0.5);
  padding:.25em .5em;
  border:2px solid lime;
  margin:0 0 .5em 0;
`;

const RecordingLight = styled.div<{ active: boolean }>`
  display:inline-block;
  border-radius:.375rem;
  width:.75rem;
  height:.75rem;
  background:${(props) => (props.active ? 'red' : 'black')};
  margin-right:.5em;
`;

interface RecorderProps {
    useVideo: boolean;
    status: string;
    startRecording: () => void;
    stopRecording: () => void;
    mediaBlobUrl: string | null
    previewStream: MediaStream | null
    previewAudioStream: MediaStream | null
    length: number;
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
}) => {
  return (
    <div>
      <p>
        <b>Record!</b>
        <br />
        Make sure your browser allows access to your microphone and/or camera.
        You should see an audio/video preview below. If no image or audio
        appears, make sure other applications are not using your camera.
      </p>
      <div>
        {status === 'stopped' ? (
          <>
            Preview your recording below. If you are happy with it, click next
            to continue, or click below to re-record.
            <RecordingButton onClick={startRecording}>
              <RecordingLight active={false} />
              Re-record **Warning, your previous video will be lost**.
            </RecordingButton>
          </>
        ) : status === 'recording' ? (
          <RecordingButton onClick={stopRecording}>
            <RecordingLight active={true} />
            Stop Recording
          </RecordingButton>
        ) : (
          <RecordingButton onClick={startRecording}>
            <RecordingLight active={false} />
            Start Recording
          </RecordingButton>
        )}

        <br />
        {useVideo ? (
          <>
            {status === 'stopped' ? (
                //@ts-ignore
              <PreviewVid src={mediaBlobUrl} controls playsInline />
            ) : (
              <>
                  {/* @ts-ignore */}
                <VideoPreview stream={previewStream} playsInline />
                <Timer {...{ status, length }} />
                {/* @ts-ignore */}
                <AudioPreview stream={previewAudioStream} />
              </>
            )}
          </>
        ) : (
          <>
            {status === 'stopped' ? (
              <audio controls>
                  {/* @ts-ignore */}
                <source src={mediaBlobUrl} />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <>
                <Timer {...{ status, length }} />
                <AudioPreview stream={previewAudioStream} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Recorder