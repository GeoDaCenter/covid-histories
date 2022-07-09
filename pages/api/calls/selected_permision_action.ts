import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { Prompts } from './_prompts'
import { getUserRecord } from './_s3_utils'
import { gather, sayOrPlay } from './_utils'
const client = twilio()

const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    const twiml = new VoiceResponse()

    getUserRecord(req.body.From).then((user) => {
      const selection = parseInt(req.body.Digits) - 1

      if (selection == 0) {
        sayOrPlay(twiml, 'TOSAgreement', user.language)
        twiml.redirect({ method: 'POST' }, '/api/calls/prompt_zipcode')
      } else if (selection == 1) {
        sayOrPlay(twiml, 'TOSSMS', user.language)
        client.messages.create({
          //@ts-ignore
          body: Prompts['TOSTextContent'][user.language || 'en'].text,
          from: '+8336062260',
          to: req.body.From
        })
        twiml.hangup()
      } else if (selection == 2) {
        sayOrPlay(twiml, 'TOSReadOutPrelude', user.language)
        gather(twiml, 'TOS', user.language, {
          finishOnKey: 0,
          actionOnEmptyResult: true
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
