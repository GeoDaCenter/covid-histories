import { Grid } from "@mui/material";
import type { NextPage } from "next";
import styled from "styled-components";
import { HomeSection } from "../components/HomeSection";
import colors from "../config/colors";
import styles from "../styles/Home.module.css";

const CTAButton = styled.a`
  background: ${colors.orange};
  color: ${colors.darkgray};
  padding: 0.5em 1em;
  border-radius: 0.25em;
  font-weight: bold;
  margin: 4em 0;
  transition: 250ms box-shadow;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0);
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.35);
  }
`;

const QuietCTAButton = styled(CTAButton)`
  background: none;
  color: ${colors.skyblue};
  border: 1px solid ${colors.skyblue};
`;

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <HomeSection sx={{ minHeight: "100vh" }}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <h1>Tell your story about COVID</h1>
            <p>
              The COVID-19 pandemic in the US has highlighted communities’
              capacity for resilience, impacted different people in unexpected
              ways, and changed everyday life. Atlas Stories curates experiences
              behind the statistical trends. We’re working to build a more
              holistic and human audio-visual archive on the Atlas. The voices
              and perspectives included aspire to represent the diversity of
              experience and opinion in the United States.
            </p>
            <CTAButton href="/submit" className="cta-button">
              Share your story
            </CTAButton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <p>photo here</p>
          </Grid>
        </Grid>
      </HomeSection>
      <HomeSection
        sx={{
          background: "#FFF3B4",
          color: colors.darkgray,
          minHeight: "100vh",
        }}
      >
        <h2>Your experiences, your medium</h2>
        <p>
          We support four different ways to tell your story through our web
          portal or over the phone. You’re invited to share up to three
          different stories about your experiences of COVID-19 in the US. Choose
          the type of story you’d like to submit, or scroll down for more
          information.
        </p>
        <Grid container>
          <Grid item xs={12} sm={3}>
            video icon
            <br />
            <CTAButton href="/submit?type=video" className="cta-button">
              Video or audio diary
            </CTAButton>
          </Grid>
          <Grid item xs={12} sm={3}>
            written icon
            <br />
            <CTAButton href="/submit?type=written" className="cta-button">
              Written story
            </CTAButton>
          </Grid>
          <Grid item xs={12} sm={3}>
            photo icon
            <br />
            <CTAButton href="/submit?type=photo" className="cta-button">
              Photograph or image
            </CTAButton>
          </Grid>
          <Grid item xs={12} sm={3}>
            photo icon
            <br />
            <CTAButton href="/phone-instructions" className="cta-button">
              Phone-based story
            </CTAButton>
          </Grid>
        </Grid>
      </HomeSection>
      <HomeSection sx={{ minHeight: "100vh", background: colors.gray }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <h2 className="h1">More than just data</h2>
            <p>
              Atlas Stores expands the quantitative data on the US Covid Atlas
              to contextualize how and what you experienced during the pandemic.
              Stories are layered on top of our map of COVID data at the county
              level. We’re working to get an equitable group of stories from
              across the US, from cities, towns, suburbs, and everywhere in
              between.
            </p>
            <CTAButton href="/submit" className="cta-button">
              Share your story
            </CTAButton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <h2 className="h1">Keep your story</h2>
            <p>
              By sharing your story with us, you keep all the rights to use your
              story in any way you want. Our license allows us to publish your
              story, but you can choose to remove it at any time. In your
              account, you can preview and manage your submitted stories, opt in
              to future research opportunities, and share more stories.
            </p>
            <QuietCTAButton href="/submit" className="cta-button">
              Read more about our privacy policy
            </QuietCTAButton>
          </Grid>
        </Grid>
      </HomeSection>
      <HomeSection sx={{ minHeight: "50vh", background: colors.skyblue, color: colors.darkgray }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <h2 className="h1">Have more questions?</h2>
            <p>We’re here to make telling your story easy and worry-free. Contact us with any questions about how to share your story, the terms and license agreement, and how your story may be published.
            </p>
            <CTAButton href="/submit" className="cta-button">
              Share your story
            </CTAButton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <p>
            theuscovidatlas@gmail.com
            </p>
          </Grid>
        </Grid>
      </HomeSection>
    </div>
  );
};

export default Home;
