import { Box, Button, Grid, Modal, Typography } from '@mui/material'
import styled from 'styled-components'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SubmissionTypes } from '../../../stores/submission/submissionSlice'
import { selectType, setTheme, setType } from '../../../stores/submission'
import { StepComponentProps } from './types'
import colors from '../../../config/colors'
import { Icons } from '../../Icons'
import { YourCovidExperience } from './YourCovidExperience'
interface StoryOption {
	type: SubmissionTypes
	label: string
	icon: string
}

export const storyTypeOptions: StoryOption[] = [
	{
		type: 'video',
		label: 'Video or Audio Diary',
		icon: 'video'
	},
	{
		type: 'written',
		label: 'Written Story',
		icon: 'written'
	},
	{
		type: 'photo',
		label: 'Photograph or Image',
		icon: 'photo'
	},
	{
		type: 'phone',
		label: 'Phone-based Story',
		icon: 'phone'
	}
]

interface StoryButtonProps {
	active?: boolean
	onClick?: () => void
	children?: React.ReactNode | React.ReactNode[]
}

const StoryButtonEl = styled(Button)<{ active: boolean; onClick: Function }>`
	background: none;
	border: 1px solid ${(props) => (props.active ? colors.orange : colors.white)} !important;
	border-radius: 0.5em;
	padding: 1em;
	height: 100%;
	width: calc(100% - 2em);
	margin: 0 2em;
	color: ${(props) => (props.active ? colors.orange : colors.white)} !important;
	display: block !important;
	transition: 250ms all;
	svg {
		fill: ${(props) => (props.active ? colors.orange : colors.white)};
		transition: 250ms all;
		max-width: 50%;
		display: block;
		margin: 1.5em auto;
	}
	p {
		display: block;
	}
`

const StoryButton: React.FC<StoryButtonProps> = ({
	active,
	onClick,
	children
}) => {
	return (
		// @ts-ignore
		<StoryButtonEl onClick={onClick} active={active}>
			{children}
		</StoryButtonEl>
	)
}

const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%',
	background: colors.darkgray,
	borderRadius: '0.5em',
	padding: '2em',
	overflowY: 'auto'
}

export const StoryType: React.FC<StepComponentProps> = () => {
	const dispatch = useDispatch()
	const handleType = (type: SubmissionTypes) => {
		dispatch(setType(type))
	}
	const activeType = useSelector(selectType)
	const [modalOpen, setModalOpen] = React.useState(false)

	useEffect(() => {
		activeType === 'phone' && setModalOpen(true)
	}, [activeType])

	const handleModalClose = () => {
		setModalOpen(false)
		handleType('video')
	}

	return (
		<Grid
			container
			spacing={1}
			minHeight="75vh"
			alignContent="center"
			alignItems="center"
		>
			<Grid item xs={12} sx={{ marginBottom: '2em' }}>
				<Typography variant="h2">Choose your story type</Typography>
			</Grid>
			{storyTypeOptions.map(({ type, label, icon }) => {
				const Icon = Icons[icon]
				return (
					<Grid item xs={12} sm={3} key={type} sx={{ minHeight: '12em' }}>
						<StoryButton
							onClick={() => handleType(type)}
							active={activeType === type}
						>
							<Icon />
							{label}
						</StoryButton>
					</Grid>
				)
			})}
			<Modal
				open={modalOpen}
				onClose={handleModalClose}
				>
					<Box sx={modalStyle}>
						<h1>
							Thank you for choosing to share a story of the pandemic. 
						</h1>
						<p>
							To start, call the number below:
						</p>
						<h2>
							<a href="tel:+12179926843">217-992-6843</a>
						</h2>
						<p>
							<i>This is a toll free service for callers in the US. Carriers fees for minutes and texts may apply.</i>
						</p>
						<p>
							The voice prompts will guide you through the process. Below are four themes you may wish to talk about. Click a theme to see some suggested prompts or topics. 
						</p>
						<YourCovidExperience quiet={true} />
					</Box>
				</Modal>
		</Grid>
	)
}
