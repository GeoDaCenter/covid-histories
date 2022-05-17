import React from "react";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";

interface HomeSectionProps {
  sx?: {[key:string]: any};
  children?: React.ReactChild[] | React.ReactChild;
  fadeout: number;
  currInView: number;
}
export const HomeSection = React.forwardRef((props: HomeSectionProps, ref: any) => {
  const { sx, children, fadeout, currInView } = props;
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up('lg'));
  
  return (
    <Box
      ref={ref}
      sx={{
        width: "100%",
        margin:0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position:lg ? 'sticky' : 'initial',
        top:0,
        paddingBottom: lg ? '25vh' : 0,
        paddingTop: lg ? '12.5vh' : 0,
        minHeight: lg ? '150vh' : '100vh',
        transition:'250ms opacity',
        transitionDelay: '250ms visibility',
        opacity: fadeout < currInView ? 0 : 1,
        // visibility: fadeout < currInView ? 'hidden' : 'visible',
        ...sx
      }}
    >
      <Box sx={{maxWidth: '1140px', margin:'0 auto', padding:'1em', display:'block'}}>{children}</Box>
    </Box>
  );
})