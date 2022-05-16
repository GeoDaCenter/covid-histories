import React, { useEffect } from "react";
import { CtaButton, CtaLink } from "../../Interface/CTA";
import Link from "next/link";
import { Grid, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import { StepComponentProps } from "./types";
import { useDispatch } from "react-redux";
import { setEmailVerified } from "../../../stores/submission";

export const Login: React.FC<StepComponentProps> = ({
    handleNext
}) => {
    const { user } = useUser();
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (user?.email?.length && user?.email_verified){
            dispatch(setEmailVerified())   
        }
    },[user?.email, user?.email_verified])

    return !!user ? (
        <Grid container>
            <Grid item xs={12} md={6}>
                <Typography>
                    You are logged in as { user.email }.{" "}
                    {user.email_verified 
                        ? <>Your email has been verified, and you may now submit your story.</>
                        : <>You must verify your email to submit your story. Please check your email and spam folder for a confirmation.</>
                    } 
                </Typography>
            </Grid>
        </Grid>
    ) : (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h2">Signup or Login</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography>
                    You can submit stories to Atlas Stories by signing up or logging in.
                    We use user logins to protect our users from harmful materials and ensure
                    that you can manage or remove your stories in the future. You may create an account
                    using your email adress or your Google account.
                </Typography>
                <Link href="/api/auth/login" passHref>
                    <CtaLink>Signup / Login</CtaLink>
                </Link>
            </Grid>
        </Grid>
    )
}