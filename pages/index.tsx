import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material'
import type { NextPage } from 'next'
import styled from 'styled-components'
import { HomeSection } from '../components/HomeSection'
import colors from '../config/colors'
import styles from '../styles/Home.module.css'
import { CtaLink, QuietCtaLink } from '../components/Interface/CTA'
import Head from 'next/head'
import Image from 'next/image'
import { Icons } from '../components/Icons'
import { useInView } from 'react-intersection-observer';
import { color } from '@mui/system'

const StoryTypeContainer = styled(Box) <{ hideBorder?: boolean }>`
	padding-top:2em;
	margin-top:2em;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	// border-right:${props => props.hideBorder ? 'none' : '1px solid black'};
	svg {
		height:80px;
		margin:0 auto;
		display:block;
	}
	a {
		text-align: center;
		display:inline-block;
		margin:0 auto;
	}
	@media (max-width:900px) {
		border:none;
	}
`

const ProgressIndicatorBar = styled.span<{Progress: number}>`
	position:fixed;
	bottom:0;
	left:0;
	width: ${props => props.Progress * 100}%;
	max-width:100%;
	height:.25em;
	background:#F37E44;
`

const ProgressIndicator: React.FC<{containerRef: any}> = ({containerRef}) => {
	const [currScroll, setCurrScroll] = useState<number>(0);
	const [maxHeight, setMaxHeight] = useState<number>(0);
	useLayoutEffect(() => {
		if (typeof window !== "undefined" && containerRef?.current) {
			window.addEventListener('scroll', () => setCurrScroll(window.scrollY))
			window.addEventListener('resize', () => setMaxHeight(containerRef.current.getBoundingClientRect().height - window.innerHeight/2))
			setMaxHeight(containerRef.current.getBoundingClientRect().height - window.innerHeight/2)
		}
	})

	return <ProgressIndicatorBar Progress={currScroll/maxHeight}/>
}

const Home: NextPage = () => {
	const containerRef = useRef(null);
	const [homeRef, homeInView] = useInView({ threshold: 0.25 });
	const [experiencesRef, experiencesInView] = useInView({ threshold: 0.375 });
	const [moreThanDataRef, moreThanDataInView] = useInView({ threshold: 0.375 });
	const [questionsRef, questionsInView] = useInView({ threshold: 0.375 });
	
	const background = questionsInView ? colors.skyblue : moreThanDataInView ? colors.gray : experiencesInView ? '#FFF3B4' : 'none'
	const currInView = questionsInView ? 4 : moreThanDataInView ? 3 : experiencesInView ? 2 : 1

	return (
		<div className={styles.container} style={{ background }} ref={containerRef}>
			<Head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Kalam:wght@300&display=swap"
				/>
				<script type="text/javascript" src="https://translate.google.com/translate_a/element.js? cb=googleTranslateElementInit" />
			</Head>
			
			<ProgressIndicator containerRef={containerRef} />
			<HomeSection sx={{ minHeight: '100vh' }} ref={homeRef} fadeout={1} currInView={currInView}>
				<Grid container spacing={2} alignContent="center" alignItems="center">
					<Grid item xs={12} md={6}>
						<Typography variant="h2" component="h1">Share <span className="cursive" >your story</span><br/>of the pandemic</Typography>
						<Typography paddingTop="1em">
							The COVID-19 pandemic in the US has highlighted communities’
							capacity for resilience, impacted different people in unexpected
							ways, and changed everyday life. Atlas Stories curates experiences
							behind the statistical trends. We’re working to build a more
							holistic and human audio-visual archive on the Atlas. The voices
							and perspectives included aspire to represent the diversity of
							experience and opinion in the United States.
						</Typography>
						<CtaLink href="/submit" className="cta-button">
							Share your story
						</CtaLink>
						<Typography fontStyle="italic" fontSize=".75em">
							Scroll down to learn more.
						</Typography>
					</Grid>
					<Grid item xs={12} md={6}>
						<Box
							sx={{
								width: '100%',
								margin: '0 auto',
								position: 'relative',
								aspectRatio: '.9'
							}}
						>
							<img width="50%" height="auto" className={currInView === 1 ? styles.fadeIn : ''} style={{ position: 'absolute', boxShadow: '0px 0px 5px rgba(0,0,0,0.5)', left: 0, top: '10%', animationDelay: '250ms' }} src="/images/hero-2.jpg" />
							<img width="65%" height="auto" className={currInView === 1 ? styles.fadeIn : ''} style={{ position: 'absolute', boxShadow: '0px 0px 5px rgba(0,0,0,0.5)', left: '25%', top: '35%', animationDelay: '500ms' }} src="/images/hero-1.jpg" />
							<img width="40%" height="auto" className={currInView === 1 ? styles.fadeIn : ''} style={{ position: 'absolute', boxShadow: '0px 0px 5px rgba(0,0,0,0.5)', left: '5%', top: '60%', animationDelay: '750ms' }} src="/images/hero-3.jpg" />
						</Box>
					</Grid>
				</Grid>
			</HomeSection>
			<HomeSection
				ref={experiencesRef}
				sx={{
					color: colors.darkgray,
					minHeight: '100vh'
				}}
				fadeout={2}
				currInView={currInView}
			>
				<Typography variant="h2">Your experiences, your medium</Typography>
				<Typography>
					We support four different ways to tell your story through our web
					portal or over the phone. You’re invited to share up to three
					different stories about your experiences of COVID-19 in the US. Choose
					the type of story you’d like to submit, or scroll down for more
					information.
				</Typography>
				<Grid container>
					<Grid item xs={12} sm={6} md={3}>
						<span className={currInView === 2 ? styles.fadeIn : ''}>
							<StoryTypeContainer>
								<Icons.video />
								<br />
								<CtaLink href="/submit?type=video" className="cta-button">
									Video or audio diary
								</CtaLink>
							</StoryTypeContainer>
						</span>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<span className={currInView === 2 ? styles.fadeIn : ''} style={{ animationDelay: "250ms" }}>
							<StoryTypeContainer>
								<Icons.written />
								<br />
								<CtaLink href="/submit?type=written" className="cta-button">
									Written story
								</CtaLink>
							</StoryTypeContainer>
						</span>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<span className={currInView === 2 ? styles.fadeIn : ''} style={{ animationDelay: "500ms" }}>
							<StoryTypeContainer>
								<Icons.photo />
								<br />
								<CtaLink href="/submit?type=photo" className="cta-button">
									Photograph or image
								</CtaLink>
							</StoryTypeContainer>
						</span>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<span className={currInView === 2 ? styles.fadeIn : ''} style={{ animationDelay: "750ms" }}>
							<StoryTypeContainer hideBorder={true}>
								<Icons.phone />
								<br />
								<CtaLink href="/phone-instructions" className="cta-button">
									Phone-based story
								</CtaLink>
							</StoryTypeContainer>
						</span>
					</Grid>
				</Grid>
			</HomeSection>
			<HomeSection sx={{ minHeight: '100vh' }} ref={moreThanDataRef} fadeout={3} currInView={currInView}>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<Typography variant="h3">More than just data</Typography>
						<Typography>
							Atlas Stores expands the quantitative data on the US Covid Atlas
							to contextualize how and what you experienced during the pandemic.
							Stories are layered on top of our map of COVID data at the county
							level. We’re working to get an equitable group of stories from
							across the US, from cities, towns, suburbs, and everywhere in
							between.
						</Typography>
						<CtaLink href="/submit" className="cta-button">
							Share your story
						</CtaLink>
					</Grid>
					<Grid item xs={12} sm={6} className={currInView === 3 ? styles.fadeIn : ''} style={{ animationDelay: '250ms' }}>
						<Typography variant="h3">Keep your story</Typography>
						<Typography>
							By sharing your story with us, you keep all the rights to use your
							story in any way you want. Our license allows us to publish your
							story, but you can choose to remove it at any time. In your
							account, you can preview and manage your submitted stories, opt in
							to future research opportunities, and share more stories.
						</Typography>
						<QuietCtaLink href="/privacy" className="cta-button">
							Read more about our privacy policy
						</QuietCtaLink>
					</Grid>
				</Grid>
			</HomeSection>
			<HomeSection
				sx={{
					minHeight: '50vh',
					paddingBottom: '0',
					color: colors.darkgray
				}}
				ref={questionsRef}
				fadeout={4}
				currInView={currInView}
			>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<Typography variant="h4">Have more questions?</Typography>
						<Typography>
							We’re here to make telling your story easy and worry-free. Contact
							us with any questions about how to share your story, the terms and
							license agreement, and how your story may be published.
						</Typography>
					</Grid>
					<Grid item xs={12} sm={6} display="flex" alignContent="center" alignItems="center" justifyContent="center" textAlign="center">
						<Image width="40px" height="40px" src={'/email-icon.svg'} />
						<Typography variant="h6" sx={{ml: 2}}>theuscovidatlas@gmail.com</Typography>
					</Grid>
				</Grid>
			</HomeSection>
		</div>
	)
}

export default Home
