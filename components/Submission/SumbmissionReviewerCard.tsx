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
	Grid,
	TextField,
	Popper
} from '@mui/material'
import { TagFilter } from '../../pages/api/files/utils'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useNsfw } from '../../stores/nsfw'
import { SubmissionsReviewModal } from './SubmissionReviewModal'

const BlurWrapper = styled.div<{ shouldBlur: boolean }>`
	filter: ${({ shouldBlur }) => (shouldBlur ? 'blur(10px)' : 'none')};
	overflow-y :auto;
`
const PreviewImg = styled.img`
	position: fixed;
	left: 0;
	top: 0;
	pointer-events: none;
	transform: translate(-100%, -100%);
`

const Flex = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`
interface SubmissionReviewerCardProps {
	fileId: string
	state: TagFilter
	adminTags: Array<{ Key: string, Value: string }>
	// onFocus: (fileId: string) => void
	// onStateChange: () => void
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

const expandedStyle = { position: 'fixed', left: '50%', top: '50%', width: '90%', height: '90%', transform: 'translate(-50%,-50%)', zIndex: '500' }
const compactStyle = { width: '100%' }
export const SubmissionReviewerCard: React.FC<SubmissionReviewerCardProps> = ({
	fileId,
	state,
	adminTags
	// onFocus,
	// onStateChange
}) => {
	const [hasInteracted, setHasInteracted] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)
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

	// note
	const [note, setNote] = useState<string>('')
	const [deletePopperOpen, setDeletePopperOpen] = useState<boolean>(false)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
		setDeletePopperOpen(true)
	};

	const handleAction = (action: 'approve' | 'reject' | 'delete' | 'unreview' | 'delete') => updateState(fileId, action, note)
	const handleNote = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNote(event.target.value);
	};

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

	if (hasInteracted) return null

	return (
		<Grid item xs={12} sm={6} md={4} lg={3}>
			{file && (
				<Card sx={modalOpen ? expandedStyle : compactStyle}>
					<CardContent>
						<Flex>
						<Typography variant="h6" gutterBottom>
							{file.storyId}
						</Typography>
						<Button
							onClick={() => setModalOpen(p => !p)}
						>
							{modalOpen ? 'Close' : 'Expand'}
						</Button>
						</Flex>
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
						<BlurWrapper shouldBlur={shouldBlur} style={{ maxHeight: modalOpen ? '50vh' : '300px' }}>
							{!!file && (
								<StoryPreview
									type={file.storyType}
									content={file?.content}
									additionalContent={file?.additionalContent}
								/>
							)}
						</BlurWrapper>
						<Typography sx={{ fontSize: 14 }} gutterBottom>
							submitted : {file.date}
						</Typography>
						{!!file?.tags && !!file.tags.length && <Typography sx={{ fontSize: 14 }} gutterBottom>
							User Tags:{' '}
							{file.tags.map((tag: string) => <Chip label={tag} key={tag} />)}
						</Typography>}
						{!!adminTags?.length && <Typography sx={{ fontSize: 14 }} gutterBottom>
							Admin Tags:{' '}
							<ul>
								{adminTags.map((tag, i) => <li key={i}>{tag.Key}: {tag.Value}</li>)}
							</ul>
						</Typography>}
					</CardContent>
					<TextField sx={{ mx: 2 }} label="reason" maxRows={3} multiline value={note} onChange={handleNote} />
					<CardActions>
						<Button
							size="small"
							color="success"
							onClick={() => handleAction('approve')}
						>
							👍 Approve
						</Button>
						<Button
							size="small"
							color="warning"
							onClick={() => handleAction('reject')}
						>
							⚠️ Reject
						</Button>
						<Button
							size="small"
							color="info"
							onClick={() => handleAction('unreview')}
						>
							↩️ Unreview
						</Button>
						<Button
							size="small"
							color="error"
							onClick={handleClick}
						>
							❌ Delete
						</Button>
						<Popper open={deletePopperOpen} anchorEl={anchorEl}>
							<Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
								Deleting this content will immediately remove it from the server.
								<br />
								<Button
									size="small"
									color="error"
									onClick={() => handleAction('delete')}
								>
									Yes, permanently delete.
								</Button>
							</Box>
						</Popper>
					</CardActions>
				</Card>
			)}
		</Grid>
	)
}
