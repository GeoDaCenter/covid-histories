import { Grid, Typography } from "@mui/material";
import React from "react";
import { StepComponentProps } from "./types";

export const GettingStarted: React.FC<StepComponentProps> = () => {
  return (
    <Grid container spacing={5} minHeight="75vh" alignContent="center" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h2" component="h1">Getting Started</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          We know that the pandemic has impacted everyone’s life. And
          essentially everyone has a story to tell about their experience. By
          participating in this oral history, whether you decide to do a video,
          write, audio, or upload a picture you will ultimately be lifting up
          your story behind the data and allow us to humanize the statistics
          within the pandemic experience.
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          You are the author of your story! Feel free to share personal and
          heartfelt experiences or just your everyday life reflecting on how you
          have adapted. Whatever story you choose to share, it will help
          researchers and everyone better understand what COVID - 19 looked like
          for you and your community.
        </Typography>
      </Grid>
    </Grid>
  );
};
