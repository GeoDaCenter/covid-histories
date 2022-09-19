import { Box, Grid, Typography, Tabs, Tab } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCounty, selectType } from '../../../stores/submission'
import { db } from '../../../stores/indexdb/db'
import { StepComponentProps } from './types'
import { StoryPreview } from '../StoryPreview'
import dynamic from 'next/dynamic'
import { SubmissionUploadModal } from '../SubmissionUploadModal'
import { SubmissionForm } from '../SubmissionUtil/SubmissionForm'

const CountyPreview = dynamic(() => import('../SubmissionUtil/CountyPreview'), {
	ssr: false
})

// submission component
export const Submit: React.FC<StepComponentProps> = ({
	storyId,
	handleNext
}) => {
	const storyType = useSelector(selectType)
	const county = useSelector(selectCounty)
	const [tab, setTab] = React.useState(0)
	const [content, setContent] = useState<any | null>(null)
	const [additionalContent, setAdditionalContent] = useState<any | null>(null)
	const [isUploading, setIsUploading] = useState<boolean>(false)

	// load cached content
	useEffect(() => {
		const getContent = async () => {
			const entry = await db.submissions.get(0)
			if (entry?.content) {
				switch (storyType) {
					case 'written': {
						setContent(entry.content)
						return
					}
					case 'photo': {
						// @ts-ignore
						const tempUrl = URL.createObjectURL(entry.content)
						setContent(tempUrl)
						setAdditionalContent(entry.additionalContent)
						return
					}
					case 'video': {
						// @ts-ignore
						const tempUrl = URL.createObjectURL(entry.content)
						setContent(tempUrl)
						return
					}
					case 'audio': {
						// @ts-ignore
						const tempUrl = URL.createObjectURL(entry.content)
						setContent(tempUrl)
						return
					}
					default:
						return
				}
			}
		}
		getContent()
	}, [storyType])

	// handlers for UI events
	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue)
	}

	return (
		<>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<SubmissionForm
						storyId={storyId}
						setIsUploading={setIsUploading}
						handleNext={handleNext}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs
							value={tab}
							onChange={handleChangeTab}
							aria-label="basic tabs example"
						>
							<Tab label="Preview Your Story" {...a11yProps(0)} />
							<Tab label="Preview Your County" {...a11yProps(1)} />
						</Tabs>
					</Box>

					<TabPanel value={tab} index={0}>
						<Box sx={{ marginBottom: '2em' }}>
							<StoryPreview
								type={storyType}
								content={content}
								additionalContent={additionalContent}
							/>
						</Box>
					</TabPanel>
					<TabPanel value={tab} index={1}>
						{county && (
							<Box>
								<CountyPreview county={county} />
							</Box>
						)}
					</TabPanel>
				</Grid>
			</Grid>
			<SubmissionUploadModal open={isUploading} />
		</>
	)
}

// @ts-ignore
function TabPanel(props) {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	)
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	}
}
