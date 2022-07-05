import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { NextPage, GetServerSideProps } from 'next'
import Link from 'next/link'
import { useSubmissions } from '../hooks/useSubmissions'
import styles from '../styles/Home.module.css'
import { getAccessToken, useUser } from '@auth0/nextjs-auth0'
import { SubmissionReviewerCard } from '../components/Submission/SumbmissionReviewerCard'
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material'
import { HomeSection } from '../components/HomeSection'
import { useState } from 'react'
import error from 'next/error'
import { TagFilter } from './api/files/utils'
import { SubmissionsReviewModal } from '../components/Submission/SubmissionReviewModal'
import { NsfwProvider } from '../stores/nsfw'
interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
	variant: TagFilter
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props
	const { submissions, error, mutate } = useSubmissions(props.variant)
	const [focusedSubmission, setFocusedSubmission] = useState<string | null>(
		null
	)

	return (
		<NsfwProvider>
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				<SubmissionsReviewModal
					fileId={focusedSubmission}
					isOpen={focusedSubmission !== null}
					onClose={() => setFocusedSubmission(null)}
					onNext={() => console.log("Next")}
				/>
				{value === index && (
					<Box sx={{ p: 3 }}>
						{submissions && (
							<Grid container spacing={2}>
								{submissions.map((submission: Record<string, any>) => (
									<Grid item xs={12} sm={6} md={4} lg={3}>
										<SubmissionReviewerCard
											onFocus={(fileId) => setFocusedSubmission(fileId)}
											fileId={submission.fileId}
											key={submission.fileId}
											state={props.variant}
											onStateChange={() => mutate()}
										/>
									</Grid>
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
		<div className={styles.container}>
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
