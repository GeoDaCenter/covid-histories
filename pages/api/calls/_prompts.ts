import {SayLanguage, SayVoice} from "twilio/lib/twiml/VoiceResponse"


export const defaultVoice ={voice: 'alice' as SayVoice, language: 'en-US' as SayLanguage}

export const Welcome="Welcome to the Covid Atlas Histories project. We are collecting oral histories about peoples experince of the pandemic."

export const ZipCodePrompt = "We would like to place your stories in context on a map. To do so we need your zip code. Type it on your phone keypad now"
export const ZipCodeRecap = "You previously told us your zip code was "
export const InvalidZip = "I am sorry, that zip code was invalid. Please enter another"

export const ValidZip = "Thanks for entering your zip code"
  
export const ReviewPrevious= `It looks like you have already contributed to the project. You can  stories for the following categories `

export const PromptText = "To record a story "
export const ZipSuccess = "Thanks for tell us your zip code"
export const PreviousRecording = "It looks like you previously submitted a recording for this topic."

export const ZipOrTopicOptions = "To change your zipcode press 1, to record a new story of update an exising one press 2"
export const FirstRecording = "Simply tell us your story and then once your done, press the hash key"

export const TopicActions= "To listen to your story, press 1, to re-record your story press 2, to delete your story press 3 and to record another story about a different topic, press 4"


export const prompts =[
  {
    name:"Your Community",
    categories: [
      "How has your community been impacted by the pandemic? Some examples of your community may be your neighborhood, city, school, religious community, sports teams, or others.",
      "What are some things you didn’t know about your community until the pandemic? Was anything revealed during this time?",
      "How have you stayed connected to your community during the pandemic?"
    ] 
  },
  {
    name:"Your Family",
    categories: [
      "How did your family life change during the pandemic?",
      "Did you or anyone close to you contract COVID- 19?",
      "How did you navigate that experience?",
      "Talk about any hardships or challenges your family faced during the pandemic.",
    ] 
  },
  {
    name:"Your Self",
    categories: [
      "Talk about a moment that you will remember most during this time.",
      "Talk about the biggest challenge that you experienced during the pandemic.",
      "What should people in the future take away or remember most, from your pandemic experience?",
    ] 
  }
]
