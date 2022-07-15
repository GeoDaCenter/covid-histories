import { Prompts, Language } from './_prompts'
import { SayLanguage, SayVoice } from 'twilio/lib/twiml/VoiceResponse'

type VoiceOptions = {
	voice: SayVoice
	language: SayLanguage
}
export const VoiceForLanguage: Record<Language, VoiceOptions> = {
	en: {
		voice: 'Polly.Kendra',
		language: 'en-US'
	},
	es: {
		voice: 'Polly.Mia',
		language: 'es-MX'
	}
}
export const gather = (
	twiml: any,
	key: keyof typeof Prompts,
	language: Language,
	args: any
) => {
	console.log('Running gather with key ', key, ' and lauguage ', language)
	let entry = Prompts[key][language || 'en']
	if (entry.audioUrl) {
		twiml.gather(args).play(entry.audioUrl)
	} else {
		twiml.gather(args).say(VoiceForLanguage[language || 'en'], entry.text)
	}
}
export const sayOrPlay = (
	twiml: any,
	key: keyof typeof Prompts,
	language: Language
) => {
	console.log('Running say with key ', key, ' and lauguage ', language)
	let entry = Prompts[key][language || 'en']

	if (entry.audioUrl) {
		twiml.play(entry.audioUrl)
	} else {
		twiml.say({ voice: VoiceForLanguage[language || 'en'] }, entry.text)
	}
}
