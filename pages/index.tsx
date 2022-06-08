import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material'
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

const ProgressIndicatorBar = styled.span<{ Progress: number }>`
	position:fixed;
	bottom:0;
	left:0;
	width: ${props => props.Progress * 100}%;
	max-width:100%;
	height:.25em;
	background:#F37E44;
`

const ProgressIndicator: React.FC<{ containerRef: any }> = ({ containerRef }) => {
	const [currScroll, setCurrScroll] = useState<number>(0);
	const [maxHeight, setMaxHeight] = useState<number>(0);
	useLayoutEffect(() => {
		if (typeof window !== "undefined" && containerRef?.current) {
			window.addEventListener('scroll', () => setCurrScroll(window.scrollY))
			window.addEventListener('resize', () => setMaxHeight(containerRef?.current.getBoundingClientRect().height - window.innerHeight / 2))
			setMaxHeight(containerRef?.current.getBoundingClientRect().height - window.innerHeight / 2)
		}
	})

	return <ProgressIndicatorBar Progress={currScroll / maxHeight} />
}

const sectionColors = {
	'homeInView': 'none',
	'exampleMapInView': colors.teal,
	'experiencesInView': '#FFF3B4',
	'moreThanDataInView': colors.gray,
	'questionsInView': colors.skyblue
} as { [SectionName: string]: string }

interface StepParams {
	background: string
	currSectionName: string
	currSectionIndex: number
}

const getStepBackground = (inView: { [key: string]: boolean }) => {
	const sections = Object.keys(inView)
	const section = sections.find(section => inView[section])
	const stepParams: StepParams = section
		? {
			background: sectionColors[section],
			currSectionName: section,
			currSectionIndex: sections.indexOf(section)

		}
		: {
			background: 'none',
			currSectionName: 'homeInView',
			currSectionIndex: 0
		}

	return stepParams
}

const Home: NextPage = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [homeRef, homeInView] = useInView({ threshold: .5 });
	const [exampleMapRef, exampleMapInView] = useInView({ threshold: .5 });
	const mapScrollRef = useRef<HTMLElement | null>(null)
	const [experiencesRef, experiencesInView] = useInView({ threshold: .5 });
	const [moreThanDataRef, moreThanDataInView] = useInView({ threshold: .5 });
	const moreThanDataScrollRef = useRef<HTMLElement | null>(null)
	const [questionsRef, questionsInView] = useInView({ threshold: .5 });

	const {
		background,
		currSectionName,
		currSectionIndex
	}: StepParams = getStepBackground({
		homeInView,
		exampleMapInView,
		experiencesInView,
		moreThanDataInView,
		questionsInView
	})

	const scrollToPrivacy = () => moreThanDataScrollRef?.current && moreThanDataScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
	const scrollToExampleMap = () => mapScrollRef?.current && mapScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })

	return (
		<div className={styles.container} style={{ background }} ref={containerRef}>
			<Head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Sriracha&display=swap"
				/>
			</Head>

			<ProgressIndicator containerRef={containerRef} />
			<HomeSection
				ref={homeRef}
				fadeout={1}
				triggerFade={currSectionName === 'homeInView'}
			>
				<Grid container spacing={2} alignContent="center" alignItems="center">
					<Grid item xs={12} md={6}>
						<Typography variant="h2" component="h1">Share <span className="cursive" >your story</span><br />of the pandemic</Typography>
						<Typography paddingTop="1em">
							The COVID-19 pandemic highlighted community
							capacity for resilience and inequitable impacts on diverse people and places.
							This project collects stories behind the statistics and data. 
							We seek voices and perspectives that represent the diversity of experiences in the United States,
							in order to build a more holistic archive of the pandemic.
						</Typography>
						<CtaLink href="/submit" className="cta-button">
							What was your experience of the pandemic?
						</CtaLink>
						<Typography>
							Learn more by scrolling down, or jump to a topic below.
						</Typography>
						<Box sx={{pt: 1}}>
							<Button onClick={scrollToExampleMap} className="cta-button" sx={{py:0.5, px:0, fontWeight:'light', textTransform:'none', fontStyle:"italic", display:'block'}}><b>&#709;</b>&nbsp; How will my story be visualized?</Button>
							<Button onClick={scrollToExampleMap} className="cta-button" sx={{py:0.5, px:0, fontWeight:'light', textTransform:'none', fontStyle:"italic", display:'block'}}><b>&#709;</b>&nbsp; What kind of story can I share?</Button>
							<Button onClick={scrollToPrivacy} className="cta-button" sx={{py:0.5, px:0, fontWeight:'light', textTransform:'none', fontStyle:"italic", display:'block'}}><b>&#709;</b>&nbsp; Is my data private?</Button>
						</Box>
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
							<img width="60%" height="auto" className={currSectionName === 'homeInView' ? styles.fadeIn : ''} style={{ position: 'absolute', boxShadow: '0px 0px 5px rgba(0,0,0,0.5)', left: 0, top: '10%', animationDelay: '250ms' }} src="/images/grocery.jpg" />
							<img width="50%" height="auto" className={currSectionName === 'homeInView' ? styles.fadeIn : ''} style={{ position: 'absolute', boxShadow: '0px 0px 5px rgba(0,0,0,0.5)', left: '50%', top: '25%', animationDelay: '500ms' }} src="/images/work.jpg" />
							<img width="45%" height="auto" className={currSectionName === 'homeInView' ? styles.fadeIn : ''} style={{ position: 'absolute', boxShadow: '0px 0px 5px rgba(0,0,0,0.5)', left: '10%', top: '50%', animationDelay: '750ms' }} src="/images/hero-1.jpg" />
						</Box>
					</Grid>
				</Grid>
			</HomeSection>
			<HomeSection
				ref={exampleMapRef}
				fadeout={1}
				triggerFade={currSectionName === 'exampleMapInView'}
			>
				{/* @ts-ignore */}
				<Grid container spacing={2} alignContent="center" alignItems="center" ref={mapScrollRef}>
					<Grid item xs={12} md={6} display="flex" >
						<img width="90%" height="auto" className={currSectionName === 'homeInView' ? styles.fadeIn : ''} src="/images/sample-usage.jpg" />
					</Grid>

					<Grid item xs={12} md={6}>
						<Typography variant="h3" component="h2">An open archive</Typography>
						<Typography paddingTop="1em">
							Your story can be a part of the US Covid Atlas archive, adding critical context to the data.
							Stories will be tagged geographically to your county, so shared experiences of your community
							can be explored together.
						</Typography>
						<CtaLink href="/submit" className="cta-button">
							Share your story
						</CtaLink>
					</Grid>
				</Grid>
			</HomeSection>
			<HomeSection
				ref={experiencesRef}
				sx={{
					color: colors.darkgray
				}}
				fadeout={2}
				triggerFade={currSectionName === 'experiencesInView'}
			>
				<Typography variant="h3" >Your experiences, your medium</Typography>
				<Typography>
					We support four different ways to tell your story through our web
					portal or over the phone. You’re invited to share up to three
					different stories about your experiences of COVID-19 in the United States.
					Choose the type of story you would like to submit, or scroll down for more
					information.
				</Typography>
				<Grid container>
					<Grid item xs={12} sm={6} md={3}>
						<span className={currSectionName === 'experiencesInView' ? styles.fadeIn : ''}>
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
						<span className={currSectionName === 'experiencesInView' ? styles.fadeIn : ''} style={{ animationDelay: "250ms" }}>
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
						<span className={currSectionName === 'experiencesInView' ? styles.fadeIn : ''} style={{ animationDelay: "500ms" }}>
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
						<span className={currSectionName === 'experiencesInView' ? styles.fadeIn : ''} style={{ animationDelay: "750ms" }}>
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
			<HomeSection
				sx={{ minHeight: '100vh' }}
				ref={moreThanDataRef}
				fadeout={3}
				triggerFade={currSectionName === 'moreThanDataInView'}
			>

				{/* @ts-ignore */}
				<Grid container spacing={3} ref={moreThanDataScrollRef}>
					<Grid item xs={12} sm={6}>
						<Typography variant="h3">More than just data</Typography>
						<Typography>
							Atlas Stories expands the data on the US Covid Atlas
							to contextualize how and what you experienced during the pandemic.
							Stories are layered on top of our map of COVID-19 data at the county
							level. We’re working to collect an equitable group of stories from
							across the U.S., from cities, towns, suburbs, and everywhere in
							between.
						</Typography>
						<CtaLink href="/submit" className="cta-button">
							Share your story
						</CtaLink>
					</Grid>
					<Grid item xs={12} sm={6} className={currSectionName === 'moreThanDataInView' ? styles.fadeIn : ''} style={{ animationDelay: '250ms' }}>
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
					color: colors.darkgray
				}}
				ref={questionsRef}
				fadeout={4}
				triggerFade={currSectionName === 'questionsInView'}
			>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<Typography variant="h4">Have more questions?</Typography>
						<Typography>
							We’re here to make telling your story easy. Contact
							us with any questions about how to share your story, the terms and
							license agreement, and how your story may be published.
						</Typography>
					</Grid>
					<Grid item xs={12} sm={6} display="flex" alignContent="center" alignItems="center" justifyContent="center" textAlign="center">
						<Image width="40px" height="40px" src={'/email-icon.svg'} />
						<Typography variant="h6" sx={{ ml: 2 }}>theuscovidatlas@gmail.com</Typography>
					</Grid>
				</Grid>
			</HomeSection>
		</div>
	)
}

export default Home
