import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    console.log("Recording response is ", req, req.query, req.body)

    const twiml = new VoiceResponse();
    twiml.say({ voice: 'alice' }, 'Thanks for submitting your experience');
    // Render the response as XML in reply to the webhook request
    res.setHeader("content-type",'text/xml');
    res.send(twiml.toString());
  }
}

