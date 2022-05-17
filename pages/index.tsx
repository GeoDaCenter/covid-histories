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

const Home: NextPage = () => {
	const [homeRef, homeInView] = useInView({ threshold: 0.25 });
	const [experiencesRef, experiencesInView] = useInView({ threshold: 0.375 });
	const [moreThanDataRef, moreThanDataInView] = useInView({ threshold: 0.375 });
	const [questionsRef, questionsInView] = useInView({ threshold: 0.375 });

	const background = questionsInView ? colors.skyblue : moreThanDataInView ? colors.gray : experiencesInView ? '#FFF3B4' : 'none'
	const currInView = questionsInView ? 4 : moreThanDataInView ? 3 : experiencesInView ? 2 : 1

	return (
		<div className={styles.container} style={{ background }}>
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
			<HomeSection sx={{ minHeight: '100vh' }} ref={homeRef} fadeout={1} currInView={currInView}>
				<Grid container spacing={2} alignContent="center" alignItems="center">
					<Grid item xs={12} md={7}>
						<Typography variant="h1">Tell <span className="cursive" >your story</span> about COVID</Typography>
						<Typography>
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
					</Grid>
					<Grid item xs={12} md={5}>
						<Box
							sx={{
								width: '100%',
								margin: '0 auto',
								position: 'relative',
								aspectRatio: '.9'
							}}
						>
							<img width="50%" height="auto" className={currInView === 1 ? styles.fadeIn : ''} style={{ position: 'absolute', boxShadow: '0px 0px 5px rgba(0,0,0,0.5)', left: 0, top: 0, animationDelay: '250ms' }} src="/images/hero-2.jpg" />
							<img width="65%" height="auto" className={currInView === 1 ? styles.fadeIn : ''} style={{ position: 'absolute', boxShadow: '0px 0px 5px rgba(0,0,0,0.5)', left: '25%', top: '25%', animationDelay: '500ms' }} src="/images/hero-1.jpg" />
							<img width="40%" height="auto" className={currInView === 1 ? styles.fadeIn : ''} style={{ position: 'absolute', boxShadow: '0px 0px 5px rgba(0,0,0,0.5)', left: '5%', top: '50%', animationDelay: '750ms' }} src="/images/hero-3.jpg" />
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
					<Grid item xs={12} sm={6} className={currInView === 3 ? styles.fadeIn : ''} style={{ animationDelay: '750ms' }}>
						<Typography variant="h3">Keep your story</Typography>
						<Typography>
							By sharing your story with us, you keep all the rights to use your
							story in any way you want. Our license allows us to publish your
							story, but you can choose to remove it at any time. In your
							account, you can preview and manage your submitted stories, opt in
							to future research opportunities, and share more stories.
						</Typography>
						<QuietCtaLink href="/submit" className="cta-button">
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
						<CtaLink href="/submit" className="cta-button">
							Share your story
						</CtaLink>
					</Grid>
					<Grid item xs={12} sm={6}>
						<p>theuscovidatlas@gmail.com</p>
					</Grid>
				</Grid>
			</HomeSection>
		</div>
	)
}

export default Home
