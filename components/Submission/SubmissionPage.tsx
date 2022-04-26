// BASE
import React, { useEffect } from "react"
// STORE
import { useDispatch, useSelector } from "react-redux"
import {
    incrementStep, decrementStep, reset, selectStep,
    selectId, selectType, selectTheme, setTheme
} from "../../stores/submission";
import { db, resetDatabase } from '../../stores/indexdb/db';
import { useLiveQuery } from "dexie-react-hooks";
// UI
import { Box } from "@mui/material"
// COMPONENTS
import { SubmissionStepper } from "./SubmissionStepper";
import * as Steps from "./Steps";
import { SubmissionDraft } from "../../stores/indexdb/SubmissionDraft";

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
    0: Steps.Intro,
    1: Steps.GettingStarted,
    2: Steps.StoryType,
    3: Steps.YourCovidExperience,
    4: Steps.Login,
    5: Steps.InputStory,
    6: Steps.Submit,
    7: Steps.Survey
}

// const getCanProgress = ({
//     step,

// })

export const SubmissionPage: React.FC = () => {
    const dispatch = useDispatch();
    const activeStep = useSelector(selectStep)
    const storyId = useSelector(selectId)
    const storyType = useSelector(selectType)
    const handleBack = () => dispatch(decrementStep())
    const handleNext = () => dispatch(incrementStep())
    const handleReset = () => dispatch(reset())

    const dbActive = typeof db;
    // const submissionDrafts: SubmissionDraft[] = useLiveQuery(() => db.submissions.toArray());
    // const submissionIds = submissionDrafts?.map(entry => entry.storyId)
    // const currSubmissionCache = submissionDrafts.find(f => f.storyId === storyId)
    // const currentSubmissionLength = submissionDrafts?.find(f => f.storyId === storyId) //?.content.length

    const handleCacheStory = (content: string) => {
        if (db) {
            db.submissions.update(0, { content })
        }
    }

    const handleRetrieveStory = () => {
        // if (db && submissionIds && submissionIds.includes(storyId)) {
        //     const entry = submissionDrafts.find(f => f.storyId === storyId)
        //     console.log(entry)
        //     if (entry && entry.id) {
        //         return entry.content
        //     }
        // }
        return ''
    }

    useEffect(() => {
        if (db && storyId.length) {
            // resetDatabase()            
            db.submissions.get(0)
                .then(entry => {
                    if (!entry) {
                        db.submissions.add({
                            id: 0,
                            storyId: storyId,
                            type: storyType,
                            content: '',
                            completed: false
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [dbActive, storyId])


    // @ts-ignore
    const CurrentStepComponent = stepComponents[activeStep]
    return <Box sx={{ minHeight: '100vh', maxWidth: '1140px', margin: '0 auto' }}>
        {/* <StepComponent /> */}
        {/* {currentStepComponent} */}
        <CurrentStepComponent
            handleNext={handleNext}
            storyId={storyId}
            handleCacheStory={handleCacheStory}
            handleRetrieveStory={handleRetrieveStory}
            dbActive={dbActive}
        />
        <SubmissionStepper
            steps={stepsText}
            activeStep={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            handleReset={handleReset}
        />
    </Box>
}