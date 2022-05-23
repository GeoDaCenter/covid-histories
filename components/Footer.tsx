import { useUser } from "@auth0/nextjs-auth0";
import { Grid, Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import colors from "../config/colors";

const NavUl = styled.ul`
  list-style:none;
  
  margin-block-start: 0;
  margin-block-end: 0;
  padding-inline-start:0;
  li {
    margin-left:0;
    a {
      text-decoration:underline;
    }
  }
`

export const Footer: React.FC = () => {
  const { user } = useUser();
  return (
    <Box
      sx={{
        background: colors.teal,
        width: "100%",
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Grid container spacing={5} maxWidth="1600px">
          <Grid item xs={12} md={6}>
            <Typography fontWeight={"bold"} variant="h4">
              Atlas <span className="cursive">Stories</span>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <img src="/images/us-covid-atlas-cluster-logo.svg" alt="US COVID Atlas Cluster Logo" width="253px" height="50px" />
          </Grid>
          <Grid item xs={12} md={3} alignContent="center" justifyContent="center">
            <NavUl>
              <li>
                <Link href="/">
                  <a>Home</a>
                </Link>
              </li>
              <li>
                <Link href="/submit">
                  <a>Submit</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a>Privacy</a>
                </Link></li>
              <li>
                <Link href="/about">
                  <a>About</a>
                </Link>
              </li>
            </NavUl>
          </Grid>
          <Grid item xs={12} md={3}>
            {!!user ?
              <NavUl><li>
                <Link href="/my-stories">
                  <a>My Stories</a>
                </Link>
              </li>
                <li>
                  <Link href="/help">
                    <a>Help</a>
                  </Link>
                </li>
                <li>
                  <Link href="/api/auth/logout">
                    <a>Logout</a>
                  </Link></li>
              </NavUl> :
              <NavUl><li>
                <Link href="/api/auth/login?redirect=/">
                  <a>Login / Sign Up</a>
                </Link>
              </li>
              </NavUl>}
          </Grid>
          <Grid item xs={12} md={6}>
            Atlas Stories is run by the US Covid Atlas, a project by the Healthy Regions and Policy Lab and the Center for Spatial Data Science at the University of Chicago. The US Covid Atlas is funded in part by the Robert Wood Johnson Foundation.
            <br/><br/>
            <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">Powered by Netlify</a>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
