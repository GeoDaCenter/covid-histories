import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {defaultVoice, prompts, PromptText} from "./_prompts"
import {getOrCreateUserRecord} from "./_s3_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    getOrCreateUserRecord(req.body.From).then( user=>{

      const twiml = new VoiceResponse();
      twiml.say(defaultVoice, PromptText  );

      let option_prompt= prompts.map((prompt,index)=>`For a story about ${prompt.name} press ${index + 1 }`).join(", ");

      twiml.gather({numDigits:1, action:"/api/calls/selected_topic_action", bargeIn:true}).say(defaultVoice, option_prompt);

      // Render the response as XML in reply to the webhook request
      res.setHeader("content-type",'text/xml');
      res.send(twiml.toString());
    })
  }
}

