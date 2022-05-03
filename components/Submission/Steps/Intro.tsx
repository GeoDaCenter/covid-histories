import { Grid, Typography } from '@mui/material'
import React from 'react'
import { StepComponentProps } from './types'
import { CtaButton } from '../../Interface/CTA'

export const Intro: React.FC<StepComponentProps> = ({ handleNext }) => {
	return (
		<Grid container spacing={1}>
			<Grid item xs={12} sm={6}>
				<Grid container spacing={5}>
					<Grid item xs={12}>
						<Typography variant="h2">Share your story</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography>
							The US Covid Atlas project works to understand, archive, and
							represent the often unequal impact of the COVID-19 pandemic in the
							United States. The Atlas helps you access current, validated
							county-level data and spatial analysis to better understand the
							spread in your community.
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} sm={6}>
				photo here
			</Grid>
		</Grid>
	)
}
