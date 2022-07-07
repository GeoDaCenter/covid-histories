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

export const Prompts: Record<string, Record<Language, Prompt>> = {
	Welcome: {
		en: {
			text: 'Welcome to the Covid Atlas Histories project. We are collecting oral histories about peoples experience of the pandemic.',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},
	ZipCodePrompt: {
		en: {
			text: 'We would like to place your stories in context on a map. To do so we need your zip code. Type it on your phone keypad now',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},
	ZipCodeRecap: {
		en: { text: 'You previously told us your zip code was', audioUrl: null },
		es: { text: '', audioUrl: null }
	},
	InvalidZip: {
		en: {
			text: 'I am sorry, that zip code was invalid. Please enter another',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	ValidZip: {
		en: { text: 'Thanks for entering your zip code', audioUrl: null },
		es: { text: '', audioUrl: null }
	},

	ReviewPrevious: {
		en: {
			text: `It looks like you have already contributed to the project. You can  stories for the following categories `,
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	PromptText: {
		en: { text: 'To record a story ', audioUrl: null },
		es: { text: '', audioUrl: null }
	},

	ZipSuccess: {
		en: { text: 'Thanks for tell us your zip code', audioUrl: null },
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
			text: 'To change your zipcode press 1, to record a new story of update an exising one press 2',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	RecordingPrelude: {
		en: {
			text: 'Simply tell us your story and then once your done, press the hash key',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

  DeletedStory:{
    en:{
      text:"We have deleted your story",
      audioUrl:null,
    },
    es:{text:'', audioUrl:null}
  },
<<<<<<< HEAD
  {
    name:"Your Family",
    categories: [
      "How did your family life change during the pandemic?",
      "Did you or anyone close to you contract COVID- 19?",
      "How did you navigate that experience?",
      "Describe about any hardships or challenges your family faced during the pandemic.",
    ] 
  },
  {
    name:"Your Self",
    categories: [
      "Describe about a moment that you will remember most during this time.",
      "Describe about the biggest challenge that you experienced during the pandemic.",
      "What should people in the future take away or remember most, from your pandemic experience?",
    ] 
=======

	TopicActions: {
		en: {
			text: 'To listen to your story, press 1, to re-record your story press 2, to delete your story press 3 and to record another story about a different topic, press 4',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	RecodingOptionsText: {
		en: {
			text: 'To listen to your story press 1, to re-record your story press 2, to delete your story press 3 and to select another topic, press 4',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},

	PermissionsText: {
		en: {
			text: 'Portions of this call will be recorded to provide content for the atlas website. We need your permission to be able to post your stories. To agree to our terms of service press 0, to have a link to the terms of service texted to your phone, press 1, to hear the terms of service read out, press 2',
			audioUrl: null
		},
		es: { text: '', audioUrl: null }
	},
  TopicSelectPrompt:{
    en: {
      text: "For a story about your community, press one, about your family press two, for your self press three and for your work pres four",
      audioUrl:null
    },
    es:{text: '', audioUrl:null}
  },
  ZipCodeNoReply:{
    en:{
      text:"I didn't get a zip code there. Try typing again",
      audioUrl:null
    },
    es:{text:'', audioUrl:null}
  },
  Thanks:{
    en:{
      text:"Thank you",
      audioUrl:null
    },
    es:{
      text:"",
      audioUrl:null
    }
  },
  CallThanksAndNext:{
    en:{
      text:"Thanks for your story, what would you like to do next?",
      audioUrl:null
    },
    es:{
      text:"",
      audioUrl:null
    }
  },
  TOSAgreement:{
    en:{
      text:`Thanks for agreeing to our terms of service`,
      audioUrl:null
    },
    es:{
      text:``,
      audioUrl:null
    }
  },
  TOSLinkSent:{
    en:{
      text:"Thanks! Look for a link sent to your phone. Read the terms of conditions and call back if you would like to agree to them",
      audioUrl:null
    },
    es:{
      text:"",
      audioUrl:null
    }
  },
  TOSReadOutPrelude:{
    en:{
      text:"You can stop playback and return to the menu at any time by pressing 0",
      audioUrl:null
    },
    es:{
      text:"",
      audioUrl:null
    }
  },
  CountyNotFound:{
    en:{
      text:"We could not find a county that mapped your zip code",
      audioUrl:null
    },
    es:{
      text:"",
      audioUrl:null
    }
  },
  WhatCountyAreYouPartOf:{
    en:{
      text:"What county are you part of?",
      audioUrl:null
    },
    es:{
      text:"",
      audioUrl:null
    }
  },
  PressOneFor:{
    en:{
      text:"Press one for ",
      audioUrl: null
    },
    es:{
      text:"",
      audioUrl: null
    }
  },
  PressTwoFor:{
    en:{
      text:"Press two for ",
      audioUrl: null
    },
    es:{
      text:"",
      audioUrl: null
    }
  },
  PressThreeFor:{
    en:{
      text:"Press three for ",
      audioUrl: null
    },
    es:{
      text:"",
      audioUrl: null
    }
  },
  PressFourFor:{
    en:{
      text:"Press four for ",
      audioUrl: null
    },
    es:{
      text:"",
      audioUrl: null
    }
  },
  PressFiveFor:{
    en:{
      text:"Press five for ",
      audioUrl: null
    },
    es:{
      text:"",
      audioUrl: null
    }
  },
  TOSSMS:{
    en:{
      text: "You can find the Terms of Service for the Covid Atlas Stories project at this link https://stories.uscovidatlas.org/license",
      audioUrl:null
    },
    es:{
      text:"",
      audioUrl:null
    }
>>>>>>> 2e26466 (adding new flow for calls + zip to county utils)
  }
}

export const PromptLanguage: Prompt= {
		text: 'To continue in english press 1, para continuar en español presione 2',
		audioUrl: null
}

export const prompts = [
	{
		name: 'Your Community',
		categories: [
			'How has your community been impacted by the pandemic? Some examples of your community may be your neighborhood, city, school, religious community, sports teams, or others.',
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
]
