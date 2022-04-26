export interface StoryInputProps {
    handleCacheStory: (content: string) => void;
    handleLoadStateContent: (content: string) => void;
    handleRetrieveStory: () => string;
    handleNext: () => void;
    storyId: string;
    dbActive: any;
}