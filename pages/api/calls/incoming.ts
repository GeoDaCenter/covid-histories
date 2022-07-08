import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { getOrCreateUserRecord } from './_s3_utils'
import { sayOrPlay } from './_utils'
const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    getOrCreateUserRecord(req.body.From).then((user) => {
      const twiml = new VoiceResponse()
      sayOrPlay(twiml, 'Welcome', 'en')

      // twiml.say(defaultVoice, Welcome);

      if (user.zipCode !== undefined || user.responses.length > 0) {
        twiml.redirect({ method: 'POST' }, '/api/calls/recap_previous')
      } else {
        twiml.redirect({ method: 'POST' }, '/api/calls/prompt_language')
      }

      // Render the response as XML in reply to the webhook request
      res.setHeader('content-type', 'text/xml')
      res.send(twiml.toString())
    })
  }
}
