import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { prompts } from './_prompts'
import { getOrCreateUserRecord, createOrUpdateUserRecord } from './_s3_utils'
const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    const topic_id = parseInt(req.query.topic_id as string)
    const section = prompts[topic_id]

    const twiml = new VoiceResponse()

    twiml.record({
      maxLength: 60,
      finishOnKey: '#',
      transcribe: true,
      transcribeCallback: `/api/calls/transcription_result?topic_id=${topic_id}`,
      action: `/api/calls/save_recording?topic_id=${topic_id}`
    })

    res.setHeader('content-type', 'text/xml')
    res.send(twiml.toString())
  }
}
