import { Button, Grid } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { resetDatabase } from "../../../stores/indexdb/db";
import { resetSubmission } from "../../../stores/submission";
import { StepComponentProps } from "./types";

export const ThankYou: React.FC<StepComponentProps> = () => {
    const dispatch = useDispatch();
    const handleReset = () => {
        dispatch(resetSubmission('video'))        
        resetDatabase({})
    }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <h2>Thank you</h2>
      </Grid>
      <Grid item xs={12} sm={6}>
        <p>
          Your submission and survey have been successfully submitted. We will review your story for publication.
          <br/>
          If at any time you&apos;d like to remove your story, please go to &quot;My Stories&quot; and click &quot;Delete&quot;. 
          If you need help, please contact uscovidatlas@gmail.com
        </p>
        <h3>Want to submit another story?</h3>
        <Button onClick={handleReset}>Start Over</Button>
      </Grid>
    </Grid>
  );
};
