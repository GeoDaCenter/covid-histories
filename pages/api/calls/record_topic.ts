import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { prompts } from './_prompts'
const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method === 'POST') {
		const topicId = parseInt(req.query.topicId as string)

		const twiml = new VoiceResponse()

		twiml.record({
			maxLength: 60,
			finishOnKey: '#',
			transcribe: true,
			// transcribeCallback: `/api/calls/transcription_result?topicId=${topicId}`,
			action: `/api/calls/save_recording?topicId=${topicId}`
		})

		twiml.redirect(`/api/calls/prompt_topic_options?topicId=${topicId}`)

		res.setHeader('content-type', 'text/xml')
		res.send(twiml.toString())
	}
}
