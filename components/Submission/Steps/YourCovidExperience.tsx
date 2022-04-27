import React from "react";
import { Grid, Button, colors } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, selectQuestions, addQuestions, removeQuestions, setTheme } from "../../../stores/submission";

const Themes = [
  {
    title: "Your Community",
    questions: [
      "How has your community been impacted by the pandemic? Some examples of your community may be your neighborhood, city, school, religious community, sports teams, or others.",
      "What are some things you didn’t know about your community until the pandemic? Was anything revealed during this time?",
      "How have you stayed connected to your community during the pandemic?",
    ],
  },
  {
    title: "Your Work",
    questions: [
      "How was your work or education affected by the pandemic? ",
      "How did the way you work change during the pandemic? ",
      "For students, how did the way you learned or go to school change during the pandemic? ",
    ],
  },
  {
    title: "Your Family",
    questions: [
      "How did your family life change during the pandemic? ",
      "Did you or anyone close to you contract COVID-19? How did you navigate that experience? ",
      "Talk about any hardships or challenges your family faced during the pandemic.",
    ],
  },
  {
    title: "Your Self",
    questions: [
      "Talk about a moment that you will remember most during this time. ",
      "Talk about the biggest challenge that you experienced during the pandemic. ",
      "What should people in the future take away or remember most, from your pandemic experience? ",
    ],
  },
];

export const YourCovidExperience: React.FC = () => {
  const dispatch = useDispatch();
  const activeTheme = useSelector(selectTheme);
  const activeQuestions = useSelector(selectQuestions);

  const handleTheme = (theme: string) => dispatch(setTheme(theme));
  const handleQuestion = (question: string) => activeQuestions.includes(question)
    ? dispatch(removeQuestions(question))
    : dispatch(addQuestions(question))

  // const handleQuestion = (event: React.ChangeEvent<{ value: unknown }>) => dispatch()
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <h2>Your COVID Experience</h2>
        <p>
          Choose on of the five themes to get started. We’ve provided a few
          prompts to think about. Feel free to any of these to get started
          telling your story.
        </p>
      </Grid>
      <Grid item xs={12} md={3}>
        {Themes.map((theme) => (
          <Button
            onClick={() => handleTheme(theme.title)}
            sx={{
              display: 'block', textTransform: 'none', margin: '0 0 1em 0',
              color: activeTheme === theme.title ? colors.orange : "white",
              borderColor: activeTheme === theme.title ? colors.orange : "white"
            }}
            variant="outlined"
          >
            {theme.title}
          </Button>
        ))}
        {/* <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
                >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl> */}
      </Grid>
      <Grid item xs={12} md={9}>
        {!!activeTheme &&
          Themes.find((f) => f.title === activeTheme)?.questions.map(
            (question) => (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={activeQuestions.includes(question)}
                      onChange={() => handleQuestion(question)}
                    />
                  }
                  label={question}
                />
              </FormGroup>
            )
          )}
      </Grid>
    </Grid>
  );
};
