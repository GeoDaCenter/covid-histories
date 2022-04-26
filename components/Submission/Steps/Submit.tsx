import { Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectType } from "../../../stores/submission";
import * as StoryInput from "../StoryInput";
import { db } from '../../../stores/indexdb/db';
import { StepComponentProps } from "./types";

const str2blob = (txt: string) => new Blob([txt], {type: 'text/markdown'});
const base64ToBlob = (base64: string, type: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type});
    return blob
}


export const Submit: React.FC<StepComponentProps> = ({
    storyId
}) => {
    const storyType = useSelector(selectType)

    const handleSubmit = async () => {
        const entry = await db.submissions.get(0);
        const response = await fetch(`/api/upload/request_url?type=${storyType}&key=${storyId}`).then(res => res.json())
        const {
            uploadURL,
            fileName,
            ContentType
        } = response;
        if (fileName && uploadURL && entry?.content) {
            const blob = str2blob(entry.content);
            const result = await fetch(uploadURL, {
                method: 'PUT',
                body: blob
            })
            //  on complete logic
        }
    }
    return <Grid container spacing={2}>
        <Grid item xs={12}>
            <h2>Submit</h2>
            <button onClick={handleSubmit}>submit</button>
        </Grid>
        </Grid>
}