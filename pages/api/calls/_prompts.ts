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
		es: {
			text: 'Bienvenido a Atlas Stories, un proyecto del US Covid Atlas, del Laboratorio de Polizas y de Regiones de Buena Salud y la Universidad de Chicago. El US Covid Atlas es un proyecto de investigación sin fines de lucro que trabaja para comprender, archivar y representar el impacto de la pandemia que suele ser desigual en los Estados Unidos. Con el proyecto Atlas Stories, estamos recopilando historias orales sobre las experiencias de las personas durante la pandemia, para dar vida a los datos y estadísticas de COVID-19. Para obtener más información, visite stories punto us covid atlas punto org.',
			audioUrl: null
		}
	},
	ZipCodePrompt: {
		en: {
			text: 'Thanks for your interest in sharing your story. We would like to place your story in context on a map of the United States. To do so we need your zip code. Type in your 5-digit zip code on your phone keypad now',
			audioUrl: BASE_PROMPT_URL + 'ZipCodePrompt.wav'
		},
		es: {
			text: 'Gracias por su interés en compartir su historia. Nos gustaría ubicar su historia en contexto en un mapa de los Estados Unidos. Para ello necesitamos su código postal. Presione su código postal de 5 dígitos en el teclado de su teléfono ahora',
			audioUrl: null
		}
	},
	ZipCodeRecap: {
		en: {
			text: 'You previously told us your zip code was',
			audioUrl: BASE_PROMPT_URL + 'ZipCodeRecap.wav'
		},
		es: {
			text: 'Anteriormente nos dijo que su código postal era',
			audioUrl: null
		}
	},
	InvalidZip: {
		en: {
			text: 'Im sorry, that zip code was invalid. Please enter another zip code using your phone keypad now',
			audioUrl: BASE_PROMPT_URL + 'InvalidZip.wav'
		},
		es: {
			text: 'Lo siento, ese código postal no es válido. Ingrese otro código postal usando el teclado de su teléfono ahora',
			audioUrl: null
		}
	},

	ValidZip: {
		en: {
			text: 'Thanks for entering your zip code',
			audioUrl: BASE_PROMPT_URL + 'ValidZip.wav'
		},
		es: { text: 'Gracias por ingresar tu código postal', audioUrl: null }
	},

	ReviewPrevious: {
		en: {
			text: `It looks like you have already contributed to the Atlas Stories project. You can submit more stories for the following categories `,
			audioUrl: BASE_PROMPT_URL + 'ReviewPrevious.wav'
		},
		es: {
			text: 'Parece que ya has contribuido al proyecto Atlas Stories. Puede contribuir más historias para las siguientes categorías',
			audioUrl: null
		}
	},

	ZipSuccess: {
		en: {
			text: 'Thanks for telling us your zip code',
			audioUrl: BASE_PROMPT_URL + 'ZipSuccess.wav'
		},
		es: { text: 'Gracias por decirnos tu código postal', audioUrl: null }
	},

	PreviousRecording: {
		en: {
			text: 'It looks like you previously submitted a recording for this topic.',
			audioUrl: BASE_PROMPT_URL + 'PreviousRecording.wav'
		},
		es: {
			text: 'Parece que ya contribuiste una grabación sobre este tema.',
			audioUrl: null
		}
	},

	ZipOrTopicOptions: {
		en: {
			text: 'To change your zipcode, press 1. To record a new story or update an existing story, press 2',
			audioUrl: BASE_PROMPT_URL + 'ZipOrTopicOptions.wav'
		},
		es: {
			text: 'Para cambiar su código postal, presione 1. Para grabar una nueva historia o actualizar una historia existente, presione 2',
			audioUrl: null
		}
	},

	RecordingPrelude: {
		en: {
			text: 'Simply tell us your story, and then, once you are finished, press the hash or pound key',
			audioUrl: BASE_PROMPT_URL + 'RecordingPrelude.wav'
		},
		es: {
			text: 'Simplemente cuéntenos su historia y cuando haya terminado, presione la tecla numeral o “hashtag”',
			audioUrl: null
		}
	},

	DeletedStory: {
		en: {
			text: 'We have deleted your story',
			audioUrl: BASE_PROMPT_URL + 'DeletedStory'
		},
		es: { text: 'Hemos borrado tu historia', audioUrl: null }
	},
	TopicActions: {
		en: {
			text: 'To listen to your story, press 1.  To re-record your story, press 2. To delete your story, press 3. To record another story about a different topic, press 4',
			audioUrl: BASE_PROMPT_URL + 'TopicActions.wav'
		},
		es: {
			text: 'Para escuchar su historia, presione 1. Para grabar su historia de nuevo, presione 2. Para borrar su historia, presione 3. Para grabar otra historia sobre un tema diferente, presione 4',
			audioUrl: null
		}
	},

	RecordingOptionsText: {
		en: {
			text: 'To listen to your story, press 1. To re-record your story, press 2. To delete your story, press 3. To record another story about a different topic, press 4',
			audioUrl: BASE_PROMPT_URL + 'RecordingOptionsText.wav'
		},
		es: { text: '', audioUrl: null }
	},

	PermissionsText: {
		en: {
			text: 'Portions of this call will be recorded to share your story on the US Covid Atlas website at us covid atlas dot org. We need your permission to share your story. To agree to our Terms of Service, please press 0. To have a link to the Terms of Service texted to your phone, press 1. To hear the Terms of Service read outloud, press 2',
			audioUrl: BASE_PROMPT_URL + 'PermissionsText.wav'
		},
		es: {
			text: 'Se grabarán partes de esta llamada para compartir su historia en el sitio web de US Covid Atlas en us covid atlas punto org. Necesitamos su permiso para compartir su historia. Para aceptar nuestros Términos de servicio, presione 0. Para recibir un texto sobre los Términos de servicio en su teléfono, presione 1. Para escuchar los Términos de servicio en voz alta, presione 2',
			audioUrl: null
		}
	},
	TopicSelectPrompt: {
		en: {
			text: 'To share a story about Your Community, please press 1. To share a story about Your Family, press 2. For a story about Your Self or your own experience, press 3. For a story about Your Work or School, press 4',
			audioUrl: BASE_PROMPT_URL + 'TopicSelectPrompt.wav'
		},
		es: {
			text: 'Para compartir una historia sobre su comunidad, presione 1. Para compartir una historia sobre su familia, presione 2. Para compartir una historia sobre usted o su propia experiencia, presione 3. Para compartir una historia sobre su trabajo o escuela, presione 4',
			audioUrl: null
		}
	},
	ZipCodeNoReply: {
		en: {
			text: "I didn't get a zip code there. Try typing it in again",
			audioUrl: BASE_PROMPT_URL + 'ZipCodeNoReply.wav'
		},
		es: {
			text: 'No recibi un código postal. Intente teclarlo de nuevo',
			audioUrl: null
		}
	},
	Thanks: {
		en: {
			text: 'Thank you',
			audioUrl: BASE_PROMPT_URL + 'Thanks.wav'
		},
		es: {
			text: 'Gracias',
			audioUrl: null
		}
	},
	CallThanksAndNext: {
		en: {
			text: 'Thanks for submitting your story. What would you like to do next?',
			audioUrl: BASE_PROMPT_URL + 'CallThanksAndNext.wav'
		},
		es: {
			text: 'Gracias por contribuir su historia. Que le desea hacer?',
			audioUrl: null
		}
	},
	TOSAgreement: {
		en: {
			text: `Thanks for agreeing to our Terms of Service`,
			audioUrl: BASE_PROMPT_URL + 'TOSAgreement.wav'
		},
		es: {
			text: `Gracias por aceptar nuestros Términos de servicio`,
			audioUrl: null
		}
	},
	TOSLinkSent: {
		en: {
			text: 'Thanks! Look for a link sent to your phone. Read the Terms of Service and call back if you would like to agree to them. You can hang up now to read the Terms of Service.',
			audioUrl: BASE_PROMPT_URL + 'TOSLinkSent.wav'
		},
		es: {
			text: '¡Gracias! Busque un texto enviado a su teléfono. Lea los Términos de servicio y al termino llame de nuevo para aceptarlos. Puede colgar ahora para leer los Términos de servicio.',
			audioUrl: null
		}
	},
	TOSReadOutPrelude: {
		en: {
			text: 'You can stop playback and return to the menu at any time by pressing 0',
			audioUrl: BASE_PROMPT_URL + 'TOSReadOutPrelude.wav'
		},
		es: {
			text: 'Puede parar la grabacion y regresar al menú en cualquier momento presionando 0',
			audioUrl: null
		}
	},
	CountyNotFound: {
		en: {
			text: 'We could not find a county that mapped to your zip code',
			audioUrl: BASE_PROMPT_URL + 'CountyNotFound.wav'
		},
		es: {
			text: 'No pudimos encontrar un condado que corresponda a su código postal',
			audioUrl: null
		}
	},
	WhatCountyAreYouPartOf: {
		en: {
			text: 'What county do you live in?',
			audioUrl: BASE_PROMPT_URL + 'WhatCountyAreYouPartOf.wav'
		},
		es: {
			text: '¿En que condado vive?',
			audioUrl: null
		}
	},
	PressOneFor: {
		en: {
			text: 'Press 1 for ',
			audioUrl: BASE_PROMPT_URL + 'PressOneFor.wav'
		},
		es: {
			text: 'Presione uno para',
			audioUrl: null
		}
	},
	PressTwoFor: {
		en: {
			text: 'Press 2 for ',
			audioUrl: BASE_PROMPT_URL + 'PressTwoFor.wav'
		},
		es: {
			text: 'Presiona dos para',
			audioUrl: null
		}
	},
	PressThreeFor: {
		en: {
			text: 'Press 3 for ',
			audioUrl: BASE_PROMPT_URL + 'PressThreeFor.wav'
		},
		es: {
			text: 'Presiona tres para',
			audioUrl: null
		}
	},
	PressFourFor: {
		en: {
			text: 'Press 4 for ',
			audioUrl: BASE_PROMPT_URL + 'PressFourFor.wav'
		},
		es: {
			text: 'Presiona cuatro para',
			audioUrl: null
		}
	},
	PressFiveFor: {
		en: {
			text: 'Press 5 for ',
			audioUrl: BASE_PROMPT_URL + 'PressFiveFor.wav'
		},
		es: {
			text: 'Presione cinco para',
			audioUrl: null
		}
	},
	TOSSMS: {
		en: {
			text: 'You can find the Terms of Service for the US Covid Atlas Stories project at this link: https://stories.uscovidatlas.org/license',
			audioUrl: BASE_PROMPT_URL + 'TOSSMS.wav'
		},
		es: {
			text: 'Puede encontrar los Términos de servicio para el proyecto US Covid Atlas Stories en este enlace: https://stories.uscovidatlas.org/license',
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
	},
	{
		name: 'Your Work',
		categories: [
			'How was your work or education affected by the pandemic?',
			'How did the way you work change during the pandemic?',
			'For students, how did the way you learn or go to school change during the pandemic?'
		]
	}
]
