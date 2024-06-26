import { Grid, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { StepComponentProps } from './types'

export const GettingStarted: React.FC<StepComponentProps> = () => {
	return (
		<Grid
			container
			spacing={5}
			minHeight="75vh"
			alignContent="center"
			alignItems="center"
		>
			<Grid item xs={12}>
				<Typography variant="h2" component="h1">
					Getting Started
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Grid container spacing={4}>
					<Grid item xs={12} sm={6}>
						<Typography variant="h4">Your Story</Typography>
						<Typography>
							You are the author of your story! Feel free to share personal and
							heartfelt experiences or just your everyday life reflecting on how
							you have adapted. Whatever story you choose to share, it will help
							researchers and everyone better understand what COVID - 19 looked
							like for you and your community.
						</Typography>
						<br />
						<Typography>
							If at any time in submitting your story you feel distressed,
							please visit our resources page for{' '}
							<Link href="resources">
								<a style={{ textDecoration: 'underline' }}>
									emotional and mental health resources
								</a>
							</Link>
							.
						</Typography>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="h4">About Atlas Stories</Typography>
						<Typography>
							This project collects stories that show the experiences behind the
							numbers. These experiences provide a more complete understanding
							of the pandemic to the growing Atlas archive. The perspectives
							included aspire to accurately represent the diversity of
							experience and opinion in the United States. Some of these
							perspectives may be scientifically inaccurate and/or harmful, and
							include disclaimers and qualifying text.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography
							variant="h6"
							fontStyle="italic"
							fontSize="1em"
							color="rgba(160,160,160)"
						>
							Disclaimer
						</Typography>
						<Typography fontStyle="italic" color="rgba(160,160,160)">
							Oral histories represent individual experiences. The US Covid
							Atlas team reserves the right to limit misinformation, racism,
							xenophobia, gender or sexual biases and other harmful types of
							content. Also, we may be unable to publish your story due to issues 
							such as promotion of organizations/businesses or promotional linking, 
							or a story that does not reflect your personal experience. 
							Please avoid these in your submission.
							<br /><br />
							The views expressed do not necessarily reflect the views
							of the US Covid Atlas, T&amp;D, University of Chicago, RWJF.
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}
