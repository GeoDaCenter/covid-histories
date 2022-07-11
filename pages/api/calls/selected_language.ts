import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { createOrUpdateUserRecord } from './_s3_utils'
import { sayOrPlay } from './_utils'
const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method === 'POST') {
		console.log('IN selected language ')

		const number = req.body.From
		const twiml = new VoiceResponse()
		const selectedLanguage = parseInt(req.body.Digits) - 1

		switch (selectedLanguage) {
			// Listen to the topic
			case 0:
				console.log('GOT english as language')
				createOrUpdateUserRecord(number, undefined, { language: 'en' })
				twiml.redirect({ method: 'POST' }, `/api/calls/prompt_permission`)
				break

			// Re-record the topic
			case 1:
				createOrUpdateUserRecord(number, undefined, { language: 'es' })
				twiml.redirect({ method: 'POST' }, `/api/calls/prompt_permission`)
				break

			default:
				sayOrPlay(twiml, 'MissingOption', 'en')
				twiml.redirect(`/api/calls/prompt_language`)
		}

		res.setHeader('content-type', 'text/xml')
		res.send(twiml.toString())
	}
	// Render the response as XML in reply to the webhook request
}
