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
	Typography
} from '@mui/material'
import { TagFilter } from '../../pages/api/files/utils'

interface SubmissionReviewerCardProps {
	fileId: string
	state: TagFilter
	onFocus: (fileId: string) => void,
  onStateChange: ()=>void
}

export const SubmissionReviewerCard: React.FC<SubmissionReviewerCardProps> = ({
	fileId,
	state,
  onFocus,
  onStateChange
}) => {
	const { file, error, updateState } = useFile(fileId)

  const submitStateChange =(state: "accept" | "reject" | "delete" )=>{
    updateState(fileId,state, "")
    onStateChange()
  }

	return (
		<div>
			{file && (
				<Card sx={{ minWidth: '400px' }}>
					<CardContent>
						<CardActionArea onClick={() => onFocus(fileId)}>
							<Typography sx={{ fontSize: 14 }} gutterBottom>
								{file.storyId}
							</Typography>
						</CardActionArea>
						<StoryPreview
							type={file.storyType}
							content={file.content[0].url}
							additionalContent={[]}
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
					</CardContent>
					<CardActions>
						<Button
							size="small"
							variant={state === 'approved' ? 'contained' : 'text'}
							color="success"
							onClick={() => updateState(fileId, 'accept', '')}
						>
							Approved
						</Button>
						<Button
							size="small"
							variant={state === 'rejected' ? 'contained' : 'text'}
							color="error"
							onClick={() => updateState(fileId, 'reject', '')}
						>
							Rejected
						</Button>
					</CardActions>
				</Card>
			)}
		</div>
	)
}
