import React from 'react'
import { Grid, Button, colors, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectTheme,
  selectQuestions,
  setTheme
} from '../../../stores/submission'
import { SubmissionStateOuter } from '../../../stores/submission/submissionSlice'

const Themes = [
  {
    title: 'Your Community',
    questions: [
      'How has your community been impacted by the pandemic? Some examples of your community may be your neighborhood, city, school, religious community, sports teams, or others.',
      'What are some things you didn’t know about your community until the pandemic? Was anything revealed during this time?',
      'How have you stayed connected to your community during the pandemic?'
    ]
  },
  {
    title: 'Your Work',
    questions: [
      'How was your work or education affected by the pandemic? ',
      'How did the way you work change during the pandemic? ',
      'For students, how did the way you learn or go to school change during the pandemic? '
    ]
  },
  {
    title: 'Your Family',
    questions: [
      'How did your family life change during the pandemic? ',
      'Did you or anyone close to you contract COVID-19? How did you navigate that experience? ',
      'Describe any hardships or challenges your family faced during the pandemic.'
    ]
  },
  {
    title: 'Your Self',
    questions: [
      'Describe a moment that you will remember most during this time. ',
      'Describe the biggest challenge that you experienced during the pandemic. ',
      'What should people in the future take away or remember most, from your pandemic experience? '
    ]
  }
]

export const YourCovidExperience: React.FC = () => {
  const dispatch = useDispatch()
  const activeTheme = useSelector(selectTheme)
  const handleTheme = (theme: string) => dispatch(setTheme(theme))

  return (
    <Grid
      container
      spacing={1}
      minHeight="75vh"
      alignContent="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <Typography variant="h2">Your Pandemic Experience</Typography>
        <Typography>
          Choose one of the four themes to get started. We’ve provided a few
          prompts to think about. Feel free to any of these to get started
          telling your story.
        </Typography>
        <Typography color="primary">* required</Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        {Themes.map((theme, i) => (
          <Button
            onClick={() => handleTheme(theme.title)}
            key={`${theme}-${i}`}
            sx={{
              display: 'inline-block',
              textTransform: 'none',
              mr: 1,
              mt: 1,
              color: activeTheme === theme.title ? colors.orange : 'white',
              borderColor: activeTheme === theme.title ? colors.orange : 'white'
            }}
            variant="outlined"
          >
            {theme.title}
          </Button>
        ))}
      </Grid>
      <Grid item xs={12} md={9}>
        {!!activeTheme && (
          <ul>
            {Themes.find((f) => f.title === activeTheme)?.questions.map(
              (question, i) => (
                <li key={`${question}-${i}`}>
                  <Typography>{question}</Typography>
                </li>
              )
            )}
          </ul>
        )}
      </Grid>
    </Grid>
  )
}
