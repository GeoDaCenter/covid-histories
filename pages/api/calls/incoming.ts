import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {prompts} from "./_prompts"
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {

    const twiml = new VoiceResponse();
    twiml.play("https://covid-histories.vercel.app/inital_prompt.mp3");
    twiml.redirect({"method": "POST"}, "https://covid-histories.vercel.app/api/calls/prompt_topic")

    // Render the response as XML in reply to the webhook request
    res.setHeader("content-type",'text/xml');
    res.send(twiml.toString());
  }
}

