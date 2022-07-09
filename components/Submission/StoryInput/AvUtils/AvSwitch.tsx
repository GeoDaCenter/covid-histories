import React from 'react'
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Switch
} from '@mui/material'
import Link from 'next/link'

export const AvSwitch: React.FC<{
  useVideo: boolean
  toggleUseVideo: () => void
}> = ({ useVideo, toggleUseVideo }) => {
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
