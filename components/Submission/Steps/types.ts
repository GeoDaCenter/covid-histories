export interface StepComponentProps {
    step?: number;
    handleNext?: () => void;
    handleBack?: () => void;
    handleReset?: () => void;
}