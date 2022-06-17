import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {defaultVoice, prompts, PromptText, ReviewPrevious, ZipCodePrompt, ZipCodeRecap, ZipOrTopicOptions} from "./_prompts"
import {getOrCreateUserRecord} from "./_s3_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {

    getOrCreateUserRecord(req.body.From).then( user=>{
      const twiml = new VoiceResponse();

      twiml.say(defaultVoice, ReviewPrevious);
      twiml.say(defaultVoice, ZipCodeRecap)
      twiml.say(defaultVoice, user.zipCode!.split("").join(" "))

      twiml.gather({numDigits:1, action:"/api/calls/update_option_selection", bargeIn:true}).say(defaultVoice, ZipOrTopicOptions);

      // Render the response as XML in reply to the webhook request
      res.setHeader("content-type",'text/xml');
      res.send(twiml.toString());
    })
  }
}

