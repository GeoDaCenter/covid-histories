import React, { useState } from 'react'
import { Button, Tabs, Tab, Box, Grid, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { HomeSection } from '../components/HomeSection'
import styles from '../styles/Home.module.css'
import { CtaLink } from '../components/Interface/CTA'
import Head from 'next/head'
import { useUser } from '@auth0/nextjs-auth0'
import useSWR from 'swr'
import { StoryPreview } from '../components/Submission/StoryPreview'
import CountyPreview from '../components/Submission/SubmissionUtil/CountyPreview'
import { SubmissionTypes } from '../stores/submission/submissionSlice'

interface StoryProps {
	title: string
	county: {
		label: string
		value: number
		centroid: number[]
	}
	consent: boolean
	storyId: string
	storyType: SubmissionTypes
	theme: string
	tags: string[]
	date: string
	content: {
		url: string
		fileName: string
		ContentType: string | null
		fileType: string
	}[]
}
// @ts-ignore
const mdFetcher = (...args) => fetch(...args).then((res) => res.text())

const StoryPreviewWrapper: React.FC<{ story: StoryProps }> = ({ story }) => {
	const { content, storyType } = story

	const contentUrl =
		content.length === 1
			? content[0].url // @ts-ignore
			: content.find((f) => f.fileType !== 'md').url

	const additionalContentUrl =
		content.length > 1 ? content.find((f) => f.fileType === 'md')?.url : null
	const contentFetcher = storyType === 'written' ? mdFetcher : () => contentUrl
	const additionalContentFetcher = mdFetcher
	const { data: storyContent, error } = useSWR(contentUrl, contentFetcher)

	return (
		<StoryPreview
			type={story.storyType}
			content={storyContent}
			additionalContent={undefined}
		/>
	)
}
interface StoryPreviewProps {
	stories: StoryProps[]
}
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())
const StoryPreviews: React.FC<StoryPreviewProps> = ({ stories }) => {
	const [tab, setTab] = useState<number>(0)

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue)
	}
	return (
		<>
			{stories.map((story, i) => {
				const { title, date, storyType, theme, tags, county } = story
				return (
					<Grid
						container
						spacing={4}
						sx={{ my: 2, pb: 5, borderBottom: '1px solid white' }}
						key={`${title}-${date}-${i}`}
					>
						<Grid item xs={12} md={4}>
							<Typography fontWeight="bold">
								{title || 'Untitled Story'}
							</Typography>
							<Typography>Submitted on {date.slice(0, 10)}</Typography>
							<Typography>
								A {storyType} story about {theme?.toLowerCase()}
							</Typography>
							<Typography>In {county.label}</Typography>
							<Typography>Tags: {tags.join(', ')}</Typography>
							<Button
								variant="contained"
								sx={{ my: 2 }}
								onClick={() => alert('u sure')}
							>
								Delete this story
							</Button>
						</Grid>
						<Grid item xs={12} md={8}>
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
									<StoryPreviewWrapper story={story} />
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
				)
			})}
		</>
	)
}

const MyStories: NextPage = () => {
	const { user } = useUser()
	const { data, error } = useSWR('/api/files/request_files', fetcher)

	return (
		<div className={styles.container}>
			<Head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Kalam:wght@300&display=swap"
				/>
			</Head>
			<HomeSection sx={{ minHeight: '100vh', width: '100%' }}>
				{user?.email ? (
					<Grid container sx={{ width: '100%' }}>
						<Typography variant="h1">My Stories</Typography>
						{data?.length ? (
							<StoryPreviews stories={data} />
						) : (
							<Grid item xs={12}>
								<Typography variant="h2">(No stories yet)</Typography>
								<br />
								<CtaLink href="/submit" className="cta-button">
									Why not share your story?
								</CtaLink>
							</Grid>
						)}
					</Grid>
				) : (
					<div>You must login in.</div>
				)}
			</HomeSection>
		</div>
	)
}

export default MyStories

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
