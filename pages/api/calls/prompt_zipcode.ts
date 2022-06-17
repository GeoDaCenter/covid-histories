import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {defaultVoice, prompts, PromptText, ZipCodePrompt} from "./_prompts"
import {getOrCreateUserRecord} from "./_s3_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    getOrCreateUserRecord(req.body.From).then( user=>{

      const twiml = new VoiceResponse();

      twiml.gather({numDigits:5, action:"/api/calls/verify_zipcode", bargeIn:true}).say(defaultVoice, ZipCodePrompt);
      twiml.say("I didn't get a zip code there. Try typing again")

      // Render the response as XML in reply to the webhook request
      res.setHeader("content-type",'text/xml');
      res.send(twiml.toString());
    })
  }
}

