import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import colors from '../../config/colors';
interface SubmissionStepperProps {
  activeStep: number;
  steps: Array<string>;
  handleNext: () => void;
  handleBack: () => void;
  handleReset: () => void;
}

export const SubmissionStepper: React.FC<SubmissionStepperProps> = ({
  steps,
  activeStep,
  handleNext,
  handleBack,
  handleReset
}) => {

  return (
    <Box sx={{ width: '600px', maxWidth:'90vw', position: 'fixed', bottom: '0', left:'50%', transform: 'translateX(-50%)', background: colors.darkgray, padding:'0 1em 1em 1em' }}>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, textTransform:'none' }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
      <Stepper activeStep={activeStep} sx={{marginTop: '1em'}}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps} >
              <StepLabel {...labelProps}></StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}