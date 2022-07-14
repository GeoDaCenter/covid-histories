import React, { useState, useRef } from 'react'
import {
	Button,
	Tabs,
	Tab,
	Box,
	Grid,
	Typography,
	Popover
} from '@mui/material'
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
import { SEO } from '../components/Interface/SEO'
import { findCounty } from '../utils/findCounty'

export interface StoryProps {
	title: string
	fips: number,
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
			: content.find((f) => f.fileType !== 'md')?.url

	const additionalContentUrl =
		content.length > 1 ? content.find((f) => f.fileType === 'md')?.url : null

	const contentFetcher = storyType === 'written' ? mdFetcher : () => contentUrl

	const { data: storyContent, error } = useSWR(contentUrl, contentFetcher)
	const { data: additionalContent, error: additionalContentError } = useSWR(
		additionalContentUrl,
		mdFetcher
	)

	return (
		<StoryPreview
			type={story.storyType}
			content={storyContent}
			additionalContent={additionalContent}
		/>
	)
}

const StoryManager: React.FC<{ story: StoryProps }> = ({ story }) => {
	const { title, date, storyType, theme, tags, fips } = story
	const county = findCounty(fips)
	
	const anchorEl = useRef(null)
	const [tab, setTab] = useState(0)
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
	const [isDeleted, setIsDeleted] = useState(false)
	const [error, setError] = useState('')

	const handleClose = () => setConfirmDeleteOpen(false)
	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue)
	}
	const handleDelete = async () => {
		const res = await fetch(`/api/files/delete_story`, {
			method: 'POST',
			body: story.storyId
		})

		if (res.ok) {
			setIsDeleted(true)
			handleClose()
		} else {
			setError(
				'There was an error deleting your story. Please try again later.'
			)
			handleClose()
		}
	}
	if (isDeleted) {
		return (
			<Grid
				container
				spacing={4}
				sx={{ my: 2, pb: 5, borderBottom: '1px solid white' }}
			>
				<Grid item xs={12} md={4}>
					<Typography fontWeight="bold">{title || 'Untitled Story'}</Typography>
					<Typography>Submitted on {date.slice(0, 10)}</Typography>
					<Typography>
						A {storyType} story about {theme?.toLowerCase()}
					</Typography>
					<Typography>In {county.label}</Typography>
					<Typography>Tags: {tags?.join(', ')}</Typography>
				</Grid>
				<Grid item xs={12} md={8}>
					<Typography>
						This story has been marked for deletion. It may take up to 7 days
						for this change to be reflected.
					</Typography>
				</Grid>
			</Grid>
		)
	}

	return (
		<Grid
			container
			spacing={4}
			sx={{ my: 2, pb: 5, borderBottom: '1px solid white' }}
		>
			<Grid item xs={12} md={4}>
				<Typography fontWeight="bold">{title || 'Untitled Story'}</Typography>
				<Typography>Submitted on {date.slice(0, 10)}</Typography>
				<Typography>
					A {storyType} story about {theme?.toLowerCase()}
				</Typography>
				<Typography>In {county.label}</Typography>
				<Typography>Tags: {tags?.join(', ')}</Typography>
				<Button
					variant="contained"
					sx={{ my: 2, textTransform: 'none' }}
					onClick={() => setConfirmDeleteOpen(true)}
					ref={anchorEl}
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
			<Popover
				id={`delete-story-popover-${story.storyId}`}
				open={confirmDeleteOpen}
				anchorEl={anchorEl.current}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
			>
				<Typography sx={{ p: 2 }}>
					Are you sure you want to delete this story?
					<br />
					<strong>This cannot be undone.</strong>
				</Typography>
				<Button
					variant="contained"
					sx={{
						display: 'block',
						m: 2,
						textTransform: 'none',
						background: 'red'
					}}
					onClick={handleDelete}
				>
					I understand, permanently delete this story.
				</Button>
				<Button
					variant="contained"
					sx={{
						display: 'block',
						m: 2,
						textTransform: 'none',
						background: 'white'
					}}
					onClick={handleClose}
				>
					Nevermind, keep this story for now.
				</Button>
			</Popover>
		</Grid>
	)
}

// @ts-ignore
const storiesFetcher = (...args) => fetch(...args).then((res) => res.json())

const MyStories: NextPage = () => {
	const { user } = useUser()
	const { data, error } = useSWR('/api/files/request_files', storiesFetcher)

	return (
		<div className={styles.container}>
			<SEO title="Atlas Stories :: My Stories" />
			<HomeSection sx={{ minHeight: '100vh', width: '100%' }}>
				{user?.email ? (
					<Grid container sx={{ width: '100%' }}>
						<Typography variant="h1">My Stories</Typography>
						{!data && (
							<Grid item xs={12}>
								<Typography variant="h2">Loading, please wait.</Typography>
							</Grid>
						)}
						{!!data &&
							!!data?.length &&
							data.map((story: StoryProps, i: number) => (
								<StoryManager
									story={story}
									key={`${story.title}-${story.date}-${i}`}
								/>
							))}
						{!!data && !data?.length && (
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
