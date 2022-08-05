import { useUser } from '@auth0/nextjs-auth0'
import { Grid, Box, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import colors from '../config/colors'

const NavUl = styled.ul`
	list-style: none;

	margin-block-start: 0;
	margin-block-end: 0;
	padding-inline-start: 0;
	li {
		margin-left: 0;
		margin-top: 0.5em;
		a {
			text-decoration: underline;
		}
	}
`
const FooterEl = styled(Box)`
	background: ${colors.teal};
	width:100%;
	min-height: 50vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2em 0;
	a {
		text-decoration: underline;
	}
`

export const Footer: React.FC = () => {
	const { user } = useUser()
	return (
		<FooterEl>
			<Box>
				<Grid container spacing={5} className="standard-page-width">
					<Grid item xs={12} md={6}>
						<Typography fontWeight={'bold'} variant="h4">
							Atlas <span className="cursive">Stories</span>
						</Typography>
					</Grid>
					<Grid item xs={12} md={6}>
						<img
							src="/images/us-covid-atlas-cluster-logo.svg"
							alt="US COVID Atlas Cluster Logo"
							width="253px"
							height="50px"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={3}
						alignContent="center"
						justifyContent="center"
					>
						<NavUl>
							<li>
								<Link href="/">
									<a>Home</a>
								</Link>
							</li>
							<li>
								<Link href="/submit">
									<a>Submit</a>
								</Link>
							</li>
							<li>
								<Link href="/privacy">
									<a>Privacy</a>
								</Link>
							</li>
							<li>
								<Link href="/about">
									<a>About</a>
								</Link>
							</li>
							<li>
								<Link href="/license">
									<a>License</a>
								</Link>
							</li>
							<li>
								<Link href="/submission-overview">
									<a>Submission Help</a>
								</Link>
							</li>
						</NavUl>
					</Grid>
					<Grid item xs={12} md={3}>
						{!!user ? (
							<NavUl>
								<li>
									<Link href="/my-stories">
										<a>My Stories</a>
									</Link>
								</li>
								<li>
									<Link href="/resources">
										<a>Resources</a>
									</Link>
								</li>
								<li>
									<Link href="/api/auth/logout">
										<a>Logout</a>
									</Link>
								</li>
							</NavUl>
						) : (
							<NavUl>
								<li>
									<Link href="/api/auth/login?redirect=/">
										<a>Login / Sign Up</a>
									</Link>
								</li>
							</NavUl>
						)}
					</Grid>
					<Grid item xs={12} md={6}>
						Atlas Stories is run by the US Covid Atlas, a project led by the Healthy
						Regions and Policy Lab and the Center for Spatial Data Science at
						the University of Chicago. The US Covid Atlas is funded in part by
						the Robert Wood Johnson Foundation.
						<br />
						<br />
						Atlas Stories is co-produced with <a href="https://truthanddocumentary.org/" target="_blank" rel="noopener noreferrer">Truth &amp; Documentary</a>, a production company serving non-profits, artists, journalism outlets and documentary filmmakers, based in Chicago.
						<br />
						<br />
						<a
							href="https://www.netlify.com/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Powered by Netlify
						</a>
						<br />
						<br />
						Copyright © 2022 US Covid Atlas, Atlas Stories. All rights reserved.
					</Grid>
				</Grid>
			</Box>
		</FooterEl>
	)
}
