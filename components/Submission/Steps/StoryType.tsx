import { Grid } from "@mui/material";
import styled from "styled-components";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SubmissionTypes } from "../../../stores/submission/submissionSlice";
import { selectType, setTheme, setType } from "../../../stores/submission";
import { StepComponentProps } from "./types";
import colors from "../../../config/colors";

interface StoryOption {
  type: SubmissionTypes;
  label: string;
  icon: string;
}
const storyTypeOptions: StoryOption[] = [
  {
    type: "av",
    label: "Video or Audio Diary",
    icon: "av",
  },
  {
    type: "written",
    label: "Written Story",
    icon: "written",
  },
  {
    type: "photo",
    label: "Photograph or Image",
    icon: "photo",
  },
  {
    type: "phone",
    label: "Phone-based Story",
    icon: "phone",
  },
];

interface StoryButtonProps {
    active?: boolean
}

const StoryButton = styled.button<StoryButtonProps>`
    background:none;
    border: 1px solid ${props => props.active ? colors.orange : colors.white};
    border-radius:.5em;
    padding:1em;
    color: ${props => props.active ? colors.orange : colors.white};
    display:block;
    margin:0 auto;
    transition:250ms all;
`

export const StoryType: React.FC<StepComponentProps> = () => {
  const dispatch = useDispatch();
  const handleType = (type: SubmissionTypes) => {
      console.log(type)
      dispatch(setType(type));
  }
  const activeType = useSelector(selectType)
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <h2>Choose your story type</h2>
      </Grid>
      {storyTypeOptions.map(({ type, label, icon }) => (
        <Grid item xs={12} sm={3} key={type}>
          <StoryButton onClick={() => handleType(type)} active={activeType === type}>
            <img src={`/icons/${icon}.svg`} alt={label} />
            <br />
            {label}
          </StoryButton>
        </Grid>
      ))}
    </Grid>
  );
};
