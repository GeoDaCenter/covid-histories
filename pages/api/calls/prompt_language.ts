import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {defaultVoice, prompts, PromptLanguage} from "./_prompts"
import {getUserRecord} from "./_s3_utils";
import {gather, VoiceForLanguage} from "./_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
      const twiml = new VoiceResponse();

      if(PromptLanguage.audioUrl){
        twiml.gather({numDigits:1, action:"/api/calls/selected_language", bargeIn:true}).play(
          PromptLanguage.audioUrl 
        )

      }
      else{
        twiml.gather({numDigits:1, action:"/api/calls/selected_language", bargeIn:true}).say(
          VoiceForLanguage['en'], PromptLanguage.text, 
        )
      }

      // Render the response as XML in reply to the webhook request
      res.setHeader("content-type",'text/xml');
      res.send(twiml.toString());
  }
}
