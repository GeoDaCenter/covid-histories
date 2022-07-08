import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {getUserRecord} from "./_s3_utils";
import {sayOrPlay} from "./_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    const twiml = new VoiceResponse();
    getUserRecord(req.body.From).then( user=>{

      const selectedAction= parseInt(req.body.Digits);

      if(selectedAction===1){
        twiml.redirect("/api/calls/prompt_zipcode")
      }
      else if(selectedAction===2){
        twiml.redirect("/api/calls/prompt_topic")
      }
      else{
        sayOrPlay(twiml, MissingOption,user!.language)
        twiml.redirect("/api/calls/prompt_update_option_select")
      }

      // Render the response as XML in reply to the webhook request
      res.setHeader("content-type",'text/xml');
      res.send(twiml.toString());
    })
  }
}

