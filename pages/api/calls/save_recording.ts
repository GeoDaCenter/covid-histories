import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { defaultVoice, prompts, RecordingActions} from './_prompts'

import {
	createOrUpdateUserRecord,
	getUserRecord
} from './_s3_utils'
import { UserCallRecord } from './_types'
import {sayOrPlay} from './_utils'
const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method === 'POST') {
		const topic_id = parseInt(req.query.topic_id as string)
		const topic = prompts[topic_id]
		const twiml = new VoiceResponse()

		getUserRecord(req.body.From).then((user) => {
			if (req.body.RecordingUrl && user) {
				const newUser: UserCallRecord = {
					...user,
					responses: [
						...user.responses,
						{
							topic: topic.name,
							responseAudioUrl: req.body.RecordingUrl,
							duration: req.body.RecordingDuration,
							createdAt: new Date()
						}
					]
				}

				createOrUpdateUserRecord(req.body.From, newUser).then(() => {
          sayOrPlay(twiml, "CallThanksAndNext", user.language)
          twiml.redirect(`/api/calls/topic_options?topic_id=${topic_id}`)
				})
        
			}

			res.setHeader('content-type', 'text/xml')
			res.send(twiml.toString())
		})
	}
}
