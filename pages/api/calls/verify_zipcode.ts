import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import { defaultVoice, prompts, ZipSuccess } from "./_prompts";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === "POST") {
    console.log("Selected topic ", req.body);
    const twiml = new VoiceResponse();

    const selection = parseInt(req.body.Digits);
      
      twiml.say(defaultVoice, ZipSuccess);
      twiml.redirect(
        {method: "POST"},
        `/api/calls/prompt_topic`
      )
    res.setHeader("content-type", "text/xml");
    res.send(twiml.toString());
  }
  // Render the response as XML in reply to the webhook request
}
