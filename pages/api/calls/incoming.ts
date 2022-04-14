import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {

    const twiml = new VoiceResponse();
    twiml.say({ voice: 'alice' }, 'hello world! This is a test to see if audio prompts work');
    twiml.play("https://covid-histories.vercel.app/inital_prompt.mp4")
    twiml.record({
      action:"https://covid-histories.vercel.app/api/calls/record_result",
      transcribe:true,
      transcribeCallback:"https://covid-histories.vercel.app/api/calls/transcribe_result",
      maxLength:60,
      method:"POST"
    })

    // Render the response as XML in reply to the webhook request
    res.setHeader("content-type",'text/xml');
    res.send(twiml.toString());
  }
}

