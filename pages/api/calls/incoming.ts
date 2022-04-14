import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {

    const twiml = new VoiceResponse();
    twiml.say({ voice: 'alice' }, 'hello world! THis is a test');

    // Render the response as XML in reply to the webhook request
    res.setHeader("content-type",'text/xml');
    res.send(twiml.toString());
  }
}

