import * as React from 'react'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import colors from '../../config/colors'
import { useSelector } from 'react-redux'
import { selectCanGoBack, selectCanProgress } from '../../stores/submission'
interface SubmissionStepperProps {
	activeStep: number
	steps: Array<string>
	handleNext: () => void
	handleBack: () => void
	handleReset: () => void
}

export const SubmissionStepper: React.FC<SubmissionStepperProps> = ({
	steps,
	activeStep,
	handleNext,
	handleBack,
	handleReset
}) => {
	const canProgress = useSelector(selectCanProgress)
	const canGoBack = useSelector(selectCanGoBack)
	if (!canProgress && !canGoBack) {
		return null
	}

	return (
		<Box
			sx={{
				width: '600px',
				maxWidth: '90vw',
				position: 'fixed',
				bottom: '0',
				left: '50%',
				transform: 'translateX(-50%)',
				background: colors.darkgray,
				padding: '0 1em em 1em'
			}}
		>
			<MobileStepper
				activeStep={activeStep}
				sx={{ marginTop: '1em', padding: '1em' }}
				variant="progress"
				steps={steps.length + 1}
				nextButton={
					<Button
						size="small"
						variant="contained"
						onClick={handleNext}
						disabled={!canProgress || activeStep === steps.length}
					>
						Next
						<span className="material-icons">arrow_forward_ios</span>
					</Button>
				}
				backButton={
					<Button
						size="small"
						variant="contained"
						onClick={handleBack}
						disabled={!canGoBack || activeStep === 0}
					>
						<span className="material-icons">arrow_back_ios</span>
						Back
					</Button>
				}
			/>
			{/* {steps.map((label, index) => {
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
      </MobileStepper> */}
		</Box>
	)
}
