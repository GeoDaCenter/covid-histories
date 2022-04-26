import { Grid, Box } from "@mui/material";
import React from "react";
import colors from "../config/colors";

export const Footer: React.FC = () => {
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
      <Box sx={{ maxWidth: "1140px", margin: "0 auto", display: "block" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            ...items
          </Grid>
          <Grid item xs={12} sm={3}>
            ...items
          </Grid>
          <Grid item xs={12} sm={6}>
            ...logo
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
