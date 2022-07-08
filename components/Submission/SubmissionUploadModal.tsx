import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Box, Typography, LinearProgress } from '@mui/material'
import {
  selectIsUploading,
  selectUploadProgress
} from '../../stores/submission'
import colors from '../../config/colors'
import { Survey } from './Steps'

const style = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  background: colors.darkgray,
  padding: '2em',
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflowY: 'auto'
}

export const SubmissionUploadModal: React.FC<{ open: boolean }> = ({
  open
}) => {
  const uploadProgress = useSelector(selectUploadProgress)

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ padding: '0 0 1em 0' }}
        >
          Uploading your story...
        </Typography>
        <LinearProgress value={uploadProgress} variant="determinate" />
        <Typography id="modal-modal-description" sx={{ padding: '1em 0' }}>
          Please do not leave this page.
        </Typography>
        <Typography id="form-modal-description" sx={{ padding: '1em 0' }}>
          While you wait, please tell us a bit about yourself!
        </Typography>
        {/* @ts-ignore */}
        <Survey allowSubmit={false} />
      </Box>
    </Modal>
  )
}
