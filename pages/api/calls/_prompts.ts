import { SayLanguage, SayVoice } from 'twilio/lib/twiml/VoiceResponse'
export type Language = 'en' | 'es'

export const defaultVoice = {
	voice: 'alice' as SayVoice,
	language: 'en-US' as SayLanguage
}

type Prompt = {
	text: string
	audioUrl: string | null
}

const BASE_PROMPT_URL = 'https://stories.uscovidatlas.org/_prompts_audio/'

export const Prompts: Record<string, Record<Language, Prompt>> = {
	Welcome: {
		en: {
			text: 'Welcome to Atlas Stories, a project of the US Covid Atlas, from the Healthy Regions & Policies Lab and University of Chicago. The US Covid Atlas is a non-profit research project that works to understand, archive, and represent the often unequal impact of the pandemic across the United States. With the Atlas Stories project, we are collecting oral histories about peoples experiences during the pandemic, to breathe life into the data and statistics of COVID-19. To learn more, visit stories dot us covid atlas dot org. ',
			audioUrl: BASE_PROMPT_URL + 'Welcome.wav'
		},
		es: { text: '', audioUrl: null }
	},
	ZipCodePrompt: {
		en: {
			text: ' Thanks for your interest in sharing your story. We would like to place your story in context on a map of the United States. To do so we need your zip code. Type in your 5-digit zip code on your phone keypad now',
			audioUrl: BASE_PROMPT_URL + 'ZipCodePrompt.wav'
		},
		es: { text: '', audioUrl: null }
	},
	ZipCodeRecap: {
		en: {
			text: 'You previously told us your zip code was',
			audioUrl: BASE_PROMPT_URL + 'ZipCodeRecap.wav'
		},
		es: { text: '', audioUrl: null }
	},
	InvalidZip: {
		en: {
			text: 'Im sorry, that zip code was invalid. Please enter another zip code using your phone keypad now',
			audioUrl: BASE_PROMPT_URL + 'InvalidZip.wav'
		},
		es: { text: '', audioUrl: null }
	},

	ValidZip: {
		en: {
			text: 'Thanks for entering your zip code',
			audioUrl: BASE_PROMPT_URL + 'ValidZip.wav'
		},
		es: { text: '', audioUrl: null }
	},

	ReviewPrevious: {
		en: {
			text: `It looks like you have already contributed to the Atlas Stories project. You can submit more stories for the following categories `,
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	PromptText: {
		en: { text: 'To record a story ', audioUrl: null },
		es: { text: '', audioUrl: null }
	},

	ZipSuccess: {
		en: { text: 'Thanks for telling us your zip code', audioUrl: null },
		es: { text: '', audioUrl: null }
	},

	PreviousRecording: {
		en: {
			text: 'It looks like you previously submitted a recording for this topic.',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	ZipOrTopicOptions: {
		en: {
			text: 'To change your zipcode, press 1. To record a new story or update an exising story, press 2',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	RecordingPrelude: {
		en: {
			text: 'Simply tell us your story, and then, once youre finished, press the hash or pound key',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	DeletedStory: {
		en: {
			text: 'We have deleted your story',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},
	TopicActions: {
		en: {
			text: 'To listen to your story, press 1.  To re-record your story, press 2. To delete your story, press 3. To record another story about a different topic, press 4',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	RecodingOptionsText: {
		en: {
			text: 'To listen to your story, press 1. To re-record your story, press 2. To delete your story, press 3. To record another story about a different topic, press 4',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	PermissionsText: {
		en: {
			text: 'Portions of this call will be recorded to share your story on the US Covid Atlas website at us covid atlas dot org. We need your permission to share your story. To agree to our Terms of Service, please press 0. To have a link to the Terms of Service texted to your phone, press 1. To hear the Terms of Service read outloud, press 2',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},
	TopicSelectPrompt: {
		en: {
			text: 'To share a story about Your Community, please press 1. To share a story about Your Family, press 2. For a story about Your Self or your own experience, press 3. For a story about Your Work or School, press 4',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},
	ZipCodeNoReply: {
		en: {
			text: "I didn't get a zip code there. Try typing it in again",
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},
	Thanks: {
		en: {
			text: 'Thank you',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	CallThanksAndNext: {
		en: {
			text: 'Thanks for submitting your story. What would you like to do next?',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	TOSAgreement: {
		en: {
			text: `Thanks for agreeing to our Terms of Service`,
			audioUrl: null
		},
		es: {
			text: ``,
			audioUrl: null
		}
	},
	TOSLinkSent: {
		en: {
			text: 'Thanks! Look for a link sent to your phone. Read the Terms of Service and call back if you would like to agree to them. You can hang up now to reaad the Terms of Service.',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	TOSReadOutPrelude: {
		en: {
			text: 'You can stop playback and return to the menu at any time by pressing 0',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	CountyNotFound: {
		en: {
			text: 'We could not find a county that mapped to your zip code',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	WhatCountyAreYouPartOf: {
		en: {
			text: 'What county do you live in?',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	PressOneFor: {
		en: {
			text: 'Press 1 for ',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	PressTwoFor: {
		en: {
			text: 'Press 2 for ',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	PressThreeFor: {
		en: {
			text: 'Press 3 for ',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	PressFourFor: {
		en: {
			text: 'Press 4 for ',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	PressFiveFor: {
		en: {
			text: 'Press 5 for ',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	},
	TOSSMS: {
		en: {
			text: 'You can find the Terms of Service for the US Covid Atlas Stories project at this link: https://stories.uscovidatlas.org/license',
			audioUrl: null
		},
		es: {
			text: '',
			audioUrl: null
		}
	}
}

export const PromptLanguage: Prompt = {
	text: 'To continue in English, press 1. Para continuar en español, presione 2',
	audioUrl: null
}

export const prompts = [
	{
		name: 'Your Community',
		categories: [
			'How has your community been impacted by the pandemic? Some examples of your community may be your neighborhood, city, school, faith community, sports teams, or others.',
			'What are some things you didn’t know about your community until the pandemic? Was anything revealed during this time?',
			'How have you stayed connected to your community during the pandemic?'
		]
	},
	{
		name: 'Your Family',
		categories: [
			'How did your family life change during the pandemic?',
			'Did you or anyone close to you contract COVID- 19?',
			'How did you navigate that experience?',
			'Talk about any hardships or challenges your family faced during the pandemic.'
		]
	},
	{
		name: 'Your Self',
		categories: [
			'Talk about a moment that you will remember most during this time.',
			'Talk about the biggest challenge that you experienced during the pandemic.',
			'What should people in the future take away or remember most, from your pandemic experience?'
		]
	}
	{
		name: 'Your Work',
		categories: [
			'How was your work or education affected by the pandemic?',
			'How did the way you work change during the pandemic?',
			'For students, how did the way you learn or go to school change during the pandemic?'
		]
	}
]

