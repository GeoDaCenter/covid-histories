import {
	Box,
	Button,
	Chip,
	Dialog,
	Modal,
	TextField,
	Typography
} from '@mui/material'
import { useState } from 'react'
import { useFile } from '../../hooks/useFile'
import { StoryPreview } from './StoryPreview'

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '90vw',
	height: '90vh',
	maxWidth: '90vw',
	maxHeight: '90vh',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	overflowY: 'auto',
	boxShadow: 24,
	p: 4
}

interface SubmissionsReviewModalProps {
	// fileId: string | null
	isOpen: boolean
	onClose: () => void
	// onNext: () => void
	file: any
	updateState: (fileId: string,
		state: 'approve' | 'reject' | 'delete' | 'unreview',
		note: string | null) => void
}

export const SubmissionsReviewModal: React.FC<SubmissionsReviewModalProps> = ({
	file,
	isOpen,
	onClose,
	updateState
}) => {
	const [note, setNote] = useState<string>('')

	const handleAction = (action: 'approve' | 'reject' | 'delete' | 'unreview') => updateState(file.storyId, action, note)
	const handleNote = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNote(event.target.value);
	};

	return (
		<Modal onClose={onClose} open={isOpen}>
			{(file && file?.content[0]) && (
				<Box sx={style}>
					<Typography sx={{ fontSize: 14 }} gutterBottom>
						{file.storyId}
					</Typography>
					<StoryPreview
						type={file.storyType}
						content={file.content[0].url}
						additionalContent={[]}
						previewUrl={''}
					/>
					<Typography sx={{ fontSize: 14 }} gutterBottom>
						submitted : {file.date}
					</Typography>
					<Typography sx={{ fontSize: 14 }} gutterBottom>
						tags:{' '}
						{file.tags.map((tag: string) => (
							<Chip label={tag} key={tag} />
						))}
					</Typography>
					<TextField label="reason" maxRows={3} multiline value={note} onChange={handleNote} />
					<Box>
						<Button size="small" color="success" onClick={() => handleAction('approve')}>
							Approve
						</Button>
						<Button size="small" color="error" onClick={() => handleAction('reject')}>
							Reject
						</Button>
						<Button size="small" color="info" onClick={() => handleAction('unreview')}>
							Return to review pool
						</Button>
					</Box>
					{/* <Box>
						<Button color="primary" variant="contained" size="small">
							Update
						</Button>
						<Button color="secondary" variant="contained" size="small">
							Skip
						</Button>
					</Box> */}
				</Box>
			)}
		</Modal>
	)
}
