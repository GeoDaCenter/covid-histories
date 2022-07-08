import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { defaultVoice, prompts, RecordingActions} from './_prompts'

import {
	createOrUpdateUserRecord,
	getUserRecord,
  saveCallStory
} from './_s3_utils'
import { UserCallRecord } from './_types'
import {sayOrPlay} from './_utils'
const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method === 'POST') {
		const topicId = parseInt(req.query.topic_id as string)
		const topic = prompts[topicId]

		getUserRecord(req.body.From).then((user) => {
			if (req.body.RecordingUrl && user) {
        saveCallStory(req.body.From, topic.name, req.body.RecordingUrl).then(()=>{
          console.log("Saved story")
        })
			}
		})
	}
}
