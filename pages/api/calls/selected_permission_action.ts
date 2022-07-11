import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { Prompts } from './_prompts'
import { createOrUpdateUserRecord, getUserRecord } from './_s3_utils'
import { gather, sayOrPlay } from './_utils'
const client = require('twilio')(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_ACCOUNT_SID
)

const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method === 'POST') {
		const twiml = new VoiceResponse()

		getUserRecord(req.body.From).then((user) => {
			console.log('USER IS ', user)
			const selection = parseInt(req.body.Digits)
			console.log('selection  is ', selection)

			if (selection == 0) {
				sayOrPlay(twiml, 'TOSAgreement', user.language)
				createOrUpdateUserRecord(req.body.From, user, { permission: true })
				twiml.redirect({ method: 'POST' }, '/api/calls/prompt_zipcode')
			} else if (selection == 1) {
				sayOrPlay(twiml, 'TOSLinkSent', user.language)
				console.log('sending message to ', req.body.From)
				client.messages
					.create({
						//@ts-ignore
						body: Prompts['TOSTextContent'][user.language || 'en'].text,
						from: '+8336062260',
						to: req.body.From
					})
					.then((messageId: string) => console.log('message id ', messageId))
					.catch((err: any) =>
						console.log('Something went wrong sending message')
					)
				twiml.hangup()
			} else if (selection == 2) {
				console.log('Selection was read out')
				sayOrPlay(twiml, 'TOSReadOutPrelude', user.language)
				gather(twiml, 'TOS', user.language, {
					finishOnKey: 0,
					actionOnEmptyResult: true,
					action: '/api/calls/prompt_permission'
				})
			} else {
				sayOrPlay(twiml, 'MissingOption', user.language)
				twiml.redirect({ method: 'POST' }, '/api/calls/prompt_permission')
			}

			// Render the response as XML in reply to the webhook request
			res.setHeader('content-type', 'text/xml')
			res.send(twiml.toString())
		})
	}
}
