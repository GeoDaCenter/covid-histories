import { useUser } from "@auth0/nextjs-auth0";
import { Box, FormControl, FormGroup, Input, InputLabel, Select, SelectChangeEvent, Typography, FormControlLabel, Checkbox, TextField, Grid, colors, MenuItem, Button } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
    selectUserId, selectSelfIdentifiedRace,
    selectPerceivedIdentifiedRace,
    selectGenderIdentity,
    selectAge,
    selectPlaceUrbanicity,
    selectAdditionalDescription,
    setTextProperty,
    setAge,
    toggleRace,
    setRaceDescription
} from "../../../stores/survey";
import { StepComponentProps } from "./types";

const raceOptions = [
    'Asian / Pacific Islander',
    'Hispanic / Latino',
    'Black / African American',
    'Native American / Alaskan Native',
    'White',
    'Multiracial or Biracial',
    'Other'
]
const PaddedFormGroup = styled(FormGroup)`
    padding: 1rem 0;
`
const SurveyForm: React.FC<{ handleNext: () => void, allowSubmit?:boolean }> = ({
    handleNext,
    allowSubmit=true
}) => {
    const dispatch = useDispatch();

    const { user } = useUser();
    const selfIdentifiedRace = useSelector(selectSelfIdentifiedRace)
    const selfIdentifiedRaces = selfIdentifiedRace.map(race => race.name)
    const perceivedIdentifiedRace = useSelector(selectPerceivedIdentifiedRace)
    const perceivedRaces = perceivedIdentifiedRace.map(race => race.name)
    const genderIdentity = useSelector(selectGenderIdentity)
    const age = useSelector(selectAge)
    const placeUrbanicity = useSelector(selectPlaceUrbanicity)
    const additionalDescription = useSelector(selectAdditionalDescription)

    const handleTextChange = (field: string, value: string) => {
        dispatch(setTextProperty({ field, value }))
    }

    const handleAge = (value: number) => dispatch(setAge(value))

    useEffect(() => {
        if (user) {
            handleTextChange("userId", user.email || '')
        }
    }, [user]) // eslint-disable-line

    const handleSubmit = async () => {
        const response = await fetch("/api/survey", {
            method: "POST",
            body: JSON.stringify({
                email: user?.email,
                selfIdentifiedRace,
                perceivedIdentifiedRace,
                genderIdentity,
                age,
                placeUrbanicity,
                additionalDescription
            })
        })

        if (response.ok) {
            console.log("Success")
            handleNext()
        }
    }
    return (<Box
        component="form"
        autoComplete="off"
        noValidate
    >
        <Typography variant="h3">Tell us about yourself</Typography>
        <PaddedFormGroup>
            <Typography variant="h6">
                What is your self-identified race and/or ethnicity? <i>Select all that apply:</i>
            </Typography>
            {raceOptions.map((name, i) => <Grid
                key={`${name}-checkbox-self-${i}`} container spacing={1} sx={{ marginBottom: '.25em' }}>
                <Grid item xs={12} md={4}>
                    <FormControlLabel
                        control={<Checkbox checked={selfIdentifiedRaces.includes(name)} />}
                        label={name}
                        onChange={() => dispatch(toggleRace({ name, type: 'selfIdentifiedRace' }))}
                    /></Grid>
                <Grid item xs={12} md={8}>
                    {selfIdentifiedRaces.includes(name) && <TextField
                        id="outlined-multiline-flexible"
                        label={`Please describe (${name})`}
                        multiline
                        fullWidth
                        maxRows={4}
                        value={selfIdentifiedRace.find(f => f.name === name)?.description || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setRaceDescription({ name, description: e.target.value, type: 'selfIdentifiedRace' }))}
                    />}
                </Grid>
            </Grid>)}
        </PaddedFormGroup>
        <PaddedFormGroup>
            <Typography variant="h6">
                How do you think others perceive your race and/or ethnicity? <i>Select all that apply:</i>
            </Typography>
            {raceOptions.map((name, i) => <Grid
                key={`${name}-checkbox-perc-${i}`} container spacing={1} sx={{ marginBottom: '.25em' }}>
                <Grid item xs={12} md={4}>
                    <FormControlLabel
                        control={<Checkbox checked={perceivedRaces.includes(name)} />}
                        label={name}
                        onChange={() => dispatch(toggleRace({ name, type: 'perceivedIdentifiedRace' }))}
                    /></Grid>
                <Grid item xs={12} md={8}>
                    {perceivedRaces.includes(name) && <TextField
                        id="outlined-multiline-flexible"
                        label={`Please describe (${name})`}
                        multiline
                        fullWidth
                        maxRows={4}
                        value={selfIdentifiedRace.find(f => f.name === name)?.description || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setRaceDescription({ name, description: e.target.value, type: 'perceivedIdentifiedRace' }))}
                    />}
                </Grid>
            </Grid>)}
        </PaddedFormGroup>

        <PaddedFormGroup>
            {/* <Typography variant="h6">
            How old are you?
            </Typography> */}
            <TextField
                id="outlined-multiline-flexible"
                label={`How old are you?`}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                value={age}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => !isNaN(+e.target.value) && handleAge(+e.target.value)}
            />
        </PaddedFormGroup>
        <PaddedFormGroup>
            {/* <Typography variant="h6">
                What is your gender identity?
            </Typography> */}
            <TextField
                id="outlined-multiline-flexible"
                label={`What is your gender identity?`}
                value={genderIdentity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange('genderIdentity', e.target.value)}
            />
        </PaddedFormGroup>
        <PaddedFormGroup>
            {/* <Typography variant="h6">
            How would you describe the place where you live? 
            </Typography> */}
            <FormControl>
                <InputLabel id="urbanicity-label">How would you describe the place where you live?</InputLabel>
                <Select
                    id="urbanicity-label-select"
                    value={placeUrbanicity}
                    labelId="urbanicity-label"
                    onChange={(e: SelectChangeEvent) => handleTextChange("placeUrbanicity", e.target.value)}
                >
                    <MenuItem value={'Urban'}>Urban</MenuItem>
                    <MenuItem value={'Suburban'}>Suburban</MenuItem>
                    <MenuItem value={'Rural'}>Rural</MenuItem>
                </Select>
            </FormControl>
        </PaddedFormGroup>
        <PaddedFormGroup>
            {/* <Typography variant="h6">
            Is there anything more you’d like to share about yourself?
            </Typography> */}
            <TextField
                id="outlined-multiline-flexible"
                label={`Is there anything more you’d like to share about yourself?`}
                multiline
                fullWidth
                maxRows={4}
                value={additionalDescription}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange('additionalDescription', e.target.value)}
            />
        </PaddedFormGroup>
        {allowSubmit && <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
        </Button>}
    </Box>)
}

interface SurveyProps extends StepComponentProps {
    allowSubmit?: boolean
}

export const Survey: React.FC<SurveyProps> = ({
    handleNext,
    allowSubmit=true
}) => {
    return <SurveyForm handleNext={handleNext} allowSubmit={allowSubmit} />
}