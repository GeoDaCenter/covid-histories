// BASE
import React from "react"
// STORE
import { useDispatch, useSelector } from "react-redux"
import { incrementStep, decrementStep, reset, selectStep, selectType, selectTheme, setTheme } from "../../stores/submission";
// UI
import { Box } from "@mui/material"
// COMPONENTS
import { SubmissionStepper } from "./SubmissionStepper";
import * as Steps from "./Steps";

const stepsText = [
    '',
    'Get Started',
    'Story Type',
    'Your COVID Experience',
    'Login',
    'Make your Story',
    'Submit',
    'Survey'
]

const stepComponents = {
    0: <Steps.Intro />,
    1: <Steps.GettingStarted />,
    2: <Steps.StoryType />,
    3: <Steps.YourCovidExperience />,
    4: <Steps.Login />,
    5: <Steps.InputStory />,
    6: <Steps.Submit />,
    7: <Steps.Survey />
}

export const SubmissionPage: React.FC = () => {
    const dispatch = useDispatch();

    const activeStep = useSelector(selectStep)
    const handleBack = () => dispatch(decrementStep())
    const handleNext = () => dispatch(incrementStep())
    const handleReset = () => dispatch(reset())

    // @ts-ignore
    // const StepComponent = stepComponents[activeStep]

    return <Box sx={{ minHeight: '100vh', maxWidth: '1140px', margin:'0 auto' }}>
        {/* <StepComponent /> */}
        <SubmissionStepper 
            steps={stepsText} 
            activeStep={activeStep} 
            handleBack={handleBack} 
            handleNext={handleNext} 
            handleReset={handleReset} 
            />
    </Box>
}