import React from "react";
import { Box, Container } from "@mui/material";

export const HomeSection: React.FC<{
  sx?: {[key:string]: any};
  children?: React.ReactChild[] | React.ReactChild;
}> = ({ sx, children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        margin:0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Box sx={{maxWidth: '1140px', margin:'0 auto', padding:'1em', display:'block'}}>{children}</Box>
    </Box>
  );
};
