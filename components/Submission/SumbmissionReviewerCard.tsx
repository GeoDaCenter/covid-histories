import { useFile } from '../../hooks/useFile'
import { StoryPreview } from './StoryPreview'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Grid
} from '@mui/material'
import { TagFilter } from '../../pages/api/files/utils'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useNsfw } from '../../stores/nsfw'
import * as nsfwjs from 'nsfwjs'

const BlurWrapper = styled.div<{ shouldBlur: boolean }>`
  filter: ${({ shouldBlur }) => (shouldBlur ? 'blur(10px)' : 'none')};
`
const PreviewImg = styled.img`
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  transform: translate(-100%, -100%);
`
interface SubmissionReviewerCardProps {
  fileId: string
  state: TagFilter
  onFocus: (fileId: string) => void
  onStateChange: () => void
}

const detectNegativeImgContent = (
  prediction: { className: string; probability: number }[]
) => {
  const negativeFrames = prediction
    .filter((c) => {
      return ['Hentai', 'Porn', 'Sexy'].includes(c.className)
    })
    .flat()
  const negativeConfidence = negativeFrames.length
    ? negativeFrames.reduce((acc, curr) => acc + curr.probability, 0) /
      negativeFrames.length
    : 0
  return {
    status: `${negativeFrames.length}/${prediction.length} detected.`,
    confidence: Math.round(negativeConfidence * 10000) / 100
  }
}

const detectNegativeGifContent = (
  predictions: { className: string; probability: number }[][]
) => {
  const negativeFrames = predictions
    .filter((c) => {
      return ['Hentai', 'Porn', 'Sexy'].includes(c[0].className)
    })
    .flat()
  const negativeConfidence = negativeFrames.length
    ? negativeFrames.reduce((acc, curr) => acc + curr.probability, 0) /
      negativeFrames.length
    : 0

  return {
    status: `${negativeFrames.length}/${predictions.length} 🍆 frames.`,
    confidence: Math.round(negativeConfidence * 10000) / 100
  }
}
const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const SubmissionReviewerCard: React.FC<SubmissionReviewerCardProps> = ({
  fileId,
  state,
  onFocus,
  onStateChange
}) => {
  const [hasInteracted, setHasInteracted] = useState(false)
  const { file, error, updateState: _updateState } = useFile(fileId)

  // @ts-ignore
  const updateState = (...args) => {
    // @ts-ignore
    _updateState(...args)
    setHasInteracted(true)
  }

  // nsfw stuff
  const previewRef = useRef<HTMLImageElement>(null)
  const [shouldBlur, setShouldBlur] = useState<boolean>(true)
  useEffect(() => {
    if (['video', 'photo'].includes(file?.storyType)) {
      setShouldBlur(true)
    } else {
      setShouldBlur(false)
    }
  }, [file?.storyType])

  const [nsfwStatus, setNsfwStatus] = useState<{
    status: string
    confidence: number
  }>({
    status: '',
    confidence: 0
  })
  const { file: gifFile } = useFile(
    file?.storyType === 'video'
      ? fileId.split('/').slice(-1)[0]
      : 'placeholder',
    'previewGifs'
  )
  const gifUrl = gifFile?.url
  // @ts-ignore
  const { nsfw, nsfwReady } = useNsfw()

  useEffect(() => {
    if (!nsfwReady || !file?.storyType || nsfwStatus.status !== '') {
      // do nothing
    } else if (file.storyType === 'photo') {
      const img = previewRef.current
      const classify = async () => {
        await sleep(100)
        const prediction = await nsfw.classify(img)
        setNsfwStatus(detectNegativeImgContent(prediction))
      }
      if (img) {
        classify()
      }
    } else if (file.storyType === 'video' && gifUrl) {
      const img = previewRef.current
      const classify = async () => {
        await sleep(100)
        const predictions = await nsfw.classifyGif(img, {
          topk: 1
        })
        setNsfwStatus(detectNegativeGifContent(predictions))
      }
      if (img) {
        classify()
      }
    }
  }, [gifUrl, file?.storyType, nsfwReady])

  const submitStateChange = (state: 'approve' | 'reject' | 'delete') => {
    updateState(fileId, state, '')
    onStateChange()
  }

  if (hasInteracted) return null

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      {file && (
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <CardActionArea onClick={() => onFocus(fileId)}>
              <Typography variant="h6" gutterBottom>
                {file.storyId}
              </Typography>
              <hr />
            </CardActionArea>
            {['video', 'photo'].includes(file?.storyType) && (
              <Grid
                container
                alignItems={'center'}
                sx={{ mb: 2, borderBottom: '1px solid white' }}
              >
                <Grid item xs={12} sm={8}>
                  <p>
                    NSFW: {nsfwStatus.status}
                    <br />
                    Chance 😬: {nsfwStatus.confidence}%
                  </p>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={shouldBlur}
                          onChange={() => setShouldBlur((prev) => !prev)}
                        />
                      }
                      label="Blur"
                    />
                  </FormGroup>
                </Grid>
                {['video', 'photo'].includes(file?.storyType) && (
                  <PreviewImg
                    src={gifUrl || file.url}
                    alt="preview"
                    ref={previewRef}
                    crossOrigin="anonymous"
                  />
                )}
              </Grid>
            )}
            <BlurWrapper shouldBlur={shouldBlur}>
              {!!file?.content[0] && (
                <StoryPreview
                  type={file.storyType}
                  content={file.content[0].url}
                  additionalContent={[]}
                />
              )}
            </BlurWrapper>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              submitted : {file.date}
            </Typography>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              tags:{' '}
              {!!file?.tags &&
                file.tags.map((tag: string) => <Chip label={tag} key={tag} />)}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant={state === 'approved' ? 'contained' : 'text'}
              color="success"
              onClick={() => updateState(fileId, 'approve', '')}
            >
              Approve
            </Button>
            <Button
              size="small"
              variant={state === 'rejected' ? 'contained' : 'text'}
              color="error"
              onClick={() => updateState(fileId, 'reject', '')}
            >
              Reject
            </Button>
          </CardActions>
        </Card>
      )}
    </Grid>
  )
}
