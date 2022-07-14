import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { NextPage } from 'next'
import { useSubmissions } from '../hooks/useSubmissions'
import styles from '../styles/Home.module.css'
import { SubmissionReviewerCard } from '../components/Submission/SumbmissionReviewerCard'
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'
import { TagFilter } from './api/files/utils'
import { NsfwProvider } from '../stores/nsfw'
import { SEO } from '../components/Interface/SEO'
interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
	variant: TagFilter
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props
	const { submissions, error, mutate } = useSubmissions(props.variant)

	if (submissions?.error){
		return <h1>{submissions.error}</h1>
	}
	return (
		<NsfwProvider>
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{submissions === undefined && (
					<Box
						sx={{
							width: '100%',
							fontSize: '2rem',
							padding: '2rem',
							textAlign: 'center'
						}}
					>
						Loading...
					</Box>
				)}
				{submissions && !submissions.length && (
					<Box
						sx={{
							width: '100%',
							fontSize: '2rem',
							padding: '2rem',
							textAlign: 'center'
						}}
					>
						No entries.
					</Box>
				)}
				{value === index && (
					<Box sx={{ p: 3 }}>
						{submissions && (
							<Grid container spacing={2}>
								{submissions.map((submission: Record<string, any>) => (
									<SubmissionReviewerCard
										fileId={submission.fileId}
										key={submission.fileId}
										state={props.variant}
										adminTags={submission.adminTags}
										// onStateChange={() => mutate()}
									/>
								))}
							</Grid>
						)}
					</Box>
				)}
			</div>
		</NsfwProvider>
	)
}

const Admin: NextPage<{ accessToken: string }> = ({ accessToken }) => {
	const [selectedTab, setSelectedTab] = useState(0)

	return (
		<div className={styles.container} style={{padding:'1em'}}>
			<SEO title="Admin" />
			<h1>Admin</h1>
			<Box>
				<Tabs
					value={selectedTab}
					onChange={(action, tab) => setSelectedTab(tab)}
				>
					<Tab label="unreviewed" id="unreviewed" />
					<Tab label="Needs confirmation" id="confirmation" />
					<Tab label="approved" id="approved" />
					<Tab label="rejected" id="rejected" />
				</Tabs>

				<TabPanel index={0} value={selectedTab} variant="unreviewed" />
				<TabPanel index={1} value={selectedTab} variant="needs_confirmation" />
				<TabPanel index={2} value={selectedTab} variant="approved" />
				<TabPanel index={3} value={selectedTab} variant="rejected" />
			</Box>
		</div>
	)
}

export default withPageAuthRequired(Admin)
