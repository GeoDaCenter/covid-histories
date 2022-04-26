import React from "react";
import { CtaButton, CtaLink } from "../../Interface/CTA";
import Link from "next/link";
import { Grid } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import { StepComponentProps } from "./types";

export const Login: React.FC<StepComponentProps> = ({
    handleNext
}) => {
    const { user } = useUser();
    
    return !!user ? (
        <Grid container>
            <Grid item xs={12}>
                <p>You are logged in as { user }.</p>
            </Grid>
            <Grid item xs={12} md={6}>
                <CtaButton onClick={handleNext}>
                    Continue
                </CtaButton>
            </Grid>
        </Grid>
    ) : (
        <Grid container>
            <Grid item xs={12}>
                <h2>Signup or Login</h2>
            </Grid>
            <Grid item xs={12} md={6}>
                <p>
                    You can submit stories to Atlas Stories by signing up or logging in.
                    We use user logins to protect our users from harmful materials and ensure
                    that you can manage or remove your stories in the future. You may create an account
                    using your email adress or your Google account.
                </p>
                <Link href="/api/auth/login">
                    <CtaLink>Signup / Login</CtaLink>
                </Link>
            </Grid>
        </Grid>
    )
}