export interface StepComponentProps {
    step?: number;
    handleNext?: () => void;
    handleBack?: () => void;
    handleReset?: () => void;
    handleCacheStory?: (content: string) => void;
    handleRetrieveStory?: () => string;
    storyId: string;
    dbActive: any;
}