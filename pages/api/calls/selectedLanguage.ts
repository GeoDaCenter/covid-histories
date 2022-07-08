import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import { defaultVoice, FirstRecording, PreviousRecording, prompts } from "./_prompts";
import {getUserRecord} from "./_s3_utils";
import {sayOrPlay} from "./_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === "POST") {

    const number = req.body.From;
    getUserRecord(number).then((user)=>{
      const twiml = new VoiceResponse();    
      const selectedLanguage= parseInt(req.body.Digits)-1;

        switch(selectedLanguage){
          // Listen to the topic
          case 0:
            twiml.redirect({method:"POST"},`/api/calls/prompt_permission`)
            break

          // Re-record the topic
          case 1:
            twiml.redirect({method:"POST"},`/api/calls/prompt_permission`)
            break

          default:
            sayOrPlay(twiml, "MissingOption", user!.language)
            twiml.redirect(`/api/calls/prompt_language`)
        }
      
      res.setHeader("content-type", "text/xml");
      res.send(twiml.toString());
    })
  }
  // Render the response as XML in reply to the webhook request
}
