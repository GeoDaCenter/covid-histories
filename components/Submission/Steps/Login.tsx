import React, { useEffect } from "react";
import { CtaButton, CtaLink } from "../../Interface/CTA";
import Link from "next/link";
import { Alert, Grid, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import { StepComponentProps } from "./types";
import { useDispatch, useSelector } from "react-redux";
import useSWR from 'swr'
import { setEmailVerified } from "../../../stores/submission";
import { selectType } from '../../../stores/submission'
import { useRouter } from "next/router";

// @ts-ignore
const jsonFetcher = (...args) => fetch(...args).then((res) => res.json())

export const Login: React.FC<StepComponentProps> = ({
    handleNext
}) => {
    const { user } = useUser();
    const {pathname} = useRouter();
    const dispatch = useDispatch();
    const { data: storyCounts } = useSWR('/api/files/submission_counts', jsonFetcher);
    const storyType = useSelector(selectType);
    const hasExceededSubmissions = storyCounts && storyCounts[storyType] >= 3

    useEffect(() => {
        if (user?.email?.length && user?.email_verified && hasExceededSubmissions === false){
            dispatch(setEmailVerified(true)) 
        } else {
            dispatch(setEmailVerified(false)) 
        } // eslint-disable-next-line
    },[user?.email, user?.email_verified, hasExceededSubmissions])

    if (hasExceededSubmissions) {
        return <Grid container maxWidth={"80ch"} display="block" margin="0 auto">
            <Grid item xs={12}>
                <Typography variant="h3">
                    Warning: You have exceeded the maximum number of submissions for this type of story.
                </Typography>
                <Typography variant="h4">
                    You may only submit 3 stories of each type at this time.
                </Typography>
                <Typography paddingTop={"1em"}>
                    You have previously submitted {storyCounts?.video} audio/video stories, {storyCounts?.written} written stories, and {storyCounts?.photo} photo stories.
                </Typography>
                <Typography paddingTop={"1em"}>
                    If you&apos;re like, please return to the &quot;Choose your story type&quot; step and select a different type of content. 
                    You may delete an already submitted story of this type from the &quot;My Stories&quot; page.
                </Typography>
            </Grid>
        </Grid>
    }

    return !!user ? (
        <Grid container minHeight="75vh"  alignItems="center">
            <Grid item xs={12}>
                <Typography>
                    You are logged in as { user.email }.{" "}
                    <br/>
                    {user.email_verified 
                        ? <Alert severity="success" sx={{mt: 2}}>Your email has been verified, and you may now submit your story.</Alert>
                        : <Alert severity="warning" sx={{mt: 2}}>You must verify your email to submit your story. Please check your email and spam folder for a confirmation.</Alert>
                    } 
                </Typography>
            </Grid>
        </Grid>
    ) : (
        <Grid container minHeight="75vh"  alignItems="center">
            <Grid item xs={12}>
                <Typography variant="h2" component="h1">Signup or Login</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography>
                    You can submit stories to Atlas Stories by signing up or logging in.
                    We use user logins to protect our users from harmful materials and ensure
                    that you can manage or remove your stories in the future. You may create an account
                    using your email adress or your Google account.
                </Typography>
                <Link href={`/api/auth/login?redirect=${pathname}`} passHref>
                    <CtaLink>Signup / Login</CtaLink>
                </Link>
            </Grid>
        </Grid>
    )
}