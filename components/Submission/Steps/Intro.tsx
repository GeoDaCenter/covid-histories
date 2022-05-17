import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import { StepComponentProps } from './types'
import { CtaButton } from '../../Interface/CTA'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from {
    opacity: 0; 
	transform:translateY(30px);
  }

  to {
    opacity: 1; 
	transform:translateY(0px);	
  }
`;

const ThreeUpImg = styled.img`
  animation: ${fadeIn} 250ms linear 1;
  animation-fill-mode: forwards;
  opacity:0;
  position: absolute;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.5);
  animation-timing-function:cubic-bezier(0.075, 0.82, 0.165, 1);
  left: 0;
  top: 0;
  animation-delay: 250ms;
  padding:0;
`

export const Intro: React.FC<StepComponentProps> = ({ handleNext }) => {
	return (
		<Grid container spacing={1} minHeight="75vh" justifyContent="center" alignContent="center">
			<Grid item xs={12} sm={6} justifyContent="center" alignContent="center" display="flex" flexDirection="column">
						<Typography variant="h2" component="h1" marginBottom="1em">Share your story</Typography>
						<Typography>
							The US Covid Atlas project works to understand, archive, and
							represent the often unequal impact of the COVID-19 pandemic in the
							United States. The Atlas helps you access current, validated
							county-level data and spatial analysis to better understand the
							spread in your community.
						</Typography>
			</Grid>
			<Grid item xs={12} sm={6}>
				<Box
					sx={{
						width: '100%',
						margin: '0 auto',
						position: 'relative',
						aspectRatio: '.9'
					}}
				>
					<ThreeUpImg width="60%" height="auto" style={{ right: '0%', top:'10%', left: 'initial' }} src="/images/person-photographin.jpg" />
					<ThreeUpImg width="60%" height="auto" style={{ top: '35%', animationDelay: '500ms' }} src="/images/person-writing.jpg" />
					<ThreeUpImg width="50%" height="auto" style={{ right: '0%', left: 'initial', top: '60%', animationDelay: '750ms' }} src="/images/person-recording.jpg" />
				</Box>
			</Grid>
		</Grid>
	)
}
