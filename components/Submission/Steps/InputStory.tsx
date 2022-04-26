import { Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectType } from "../../../stores/submission";
import * as StoryInput from "../StoryInput";
import { StepComponentProps } from "./types";

const inputComponentMap: { [key: string]: React.FC<{ submissionType: string }> } = {
    "written": StoryInput.WrittenSubmission,
    "audio": StoryInput.AvSubmission,
    "video": StoryInput.AvSubmission,
    "photo": StoryInput.PhotoSubmission
}
export const InputStory: React.FC<StepComponentProps> = ({
    handleCacheStory,
    handleRetrieveStory,
    storyId,
    dbActive
}) => {
    const submissionType = useSelector(selectType)
    const SubmissionComponent = inputComponentMap[submissionType]

    return <Grid container spacing={2}>
        <Grid item xs={12}>
            <h2>Make your story</h2>
        </Grid>
        <Grid item xs={12}>
            <SubmissionComponent 
                submissionType={submissionType} 
                handleCacheStory={handleCacheStory} 
                handleRetrieveStory={handleRetrieveStory} 
                storyId={storyId}
                dbActive={dbActive} 
                />
        </Grid>    
    </Grid>
}