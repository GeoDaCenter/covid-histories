import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { defaultVoice, prompts } from './_prompts'
import { getPreviousCalls, getUserRecord } from './_s3_utils'
import { sayOrPlay } from './_utils'
const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method === 'POST') {
		const number = req.body.From
		getUserRecord(number).then((user) => {
			getPreviousCalls(number).then((previousCalls) => {
				const twiml = new VoiceResponse()
				const selectedOption = parseInt(req.body.Digits) - 1
				const selectedTopic = prompts[selectedOption]

				console.log('Previous calls ', previousCalls)

				const previousSubmission = previousCalls.find(
					(response) => response.topicId === selectedTopic.name
				)

				if (selectedOption < prompts.length) {
					if (previousSubmission) {
						// If the user has previously submitted a recording,
						// give them options
						twiml.redirect(
							{ method: 'POST' },
							`/api/calls/prompt_topic_options?topicId=${selectedOption}`
						)
					} else {
						sayOrPlay(twiml, 'RecordingPrelude', user.language)
						twiml.redirect(
							{ method: 'POST' },
							`/api/calls/record_topic?topicId=${selectedOption}`
						)
					}
				} else {
					sayOrPlay(twiml, 'MissingOption', user.lanaguge)
					twiml.redirect({ method: 'POST' }, '/api/calls/prompt_topic')
				}
				res.setHeader('content-type', 'text/xml')
				res.send(twiml.toString())
			})
		})
	}
	// Render the response as XML in reply to the webhook request
}
