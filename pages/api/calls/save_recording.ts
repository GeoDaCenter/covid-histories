import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { prompts } from './_prompts'

import {
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
    const twiml = new VoiceResponse();
		const topicId = parseInt(req.query.topicId as string)
		const topic = prompts[topicId]

		getUserRecord(req.body.From).then((user) => {
			if (req.body.RecordingUrl && user) {
        console.log("Recording url is ", req.body.RecordingUrl)
        saveCallStory(req.body.From, topic.name, req.body.RecordingUrl).then(()=>{
        
        twiml.say("Thanks for your recording")
        twiml.redirect(`/api/calls/prompt_topic_options?topicId=${topicId}`)
        res.setHeader("content-type", "text/xml");
        res.send(twiml.toString());
        })
			}
		})
	}

}
