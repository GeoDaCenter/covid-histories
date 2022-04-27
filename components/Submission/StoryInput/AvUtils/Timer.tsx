import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  position:relative;
  width:100%;
  height:20px;
  p {
    padding:0 .5em;
  }
`;

const CompletionBar = styled.div<{width: number}>`
  position:absolute;
  width: ${(props) => props.width * 100}%;
  height:20px;
  background:hsl(213, 60%, 50%);
  opacity:0.5;
`;

const pad = (val: number | string, len: number, filler: string | number): string | number => {
  return `${val}`.length < len ? pad(`${filler}${val}`, len, filler) : val;
}
interface TimerProps { 
  status: string
  length: number
}

const Timer: React.FC<TimerProps> = ({ status, length }) => {
  const [time, setTime] = useState<number>(0);
  const max = length * 60;
  const [intervalFunc, setIntervalFunc] = useState<typeof setInterval | null>(null);

  useEffect(() => {
    // @ts-ignore
    clearInterval(intervalFunc);
    setTime(0);
    if (status === 'recording') {
      // @ts-ignore
      setIntervalFunc(setInterval(() => setTime((prev) => prev + 0.1), 100));
    }
  }, [status]); // eslint-disable-line 
  const timestamp =
    time > 60
      ? `${Math.floor(time / 60)}:${pad(Math.floor(time) % 60, 2, 0)}`
      : `0:${pad(Math.floor(time), 2, 0)}`;

  return (
    <TimerContainer>
      <CompletionBar width={0 / max} />
      {/* time */}
      <p>
        {timestamp}
        {/* / {length}:00 */}
      </p>
    </TimerContainer>
  );
}

export default Timer