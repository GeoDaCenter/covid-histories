import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {Welcome,defaultVoice} from "./_prompts"
import { createOrUpdateUserRecord, getUserRecord } from "./_s3_utils";
import {sayOrPlay} from "./_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;
import hash from 'object-hash'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    console.log("User hash is ", hash(req.body.From))
    getUserRecord(req.body.From).then(user=>{
      console.log("got user ",user)
      const twiml = new VoiceResponse();
      sayOrPlay(twiml, "Welcome", 'en')

      if(user && user.permission){
        twiml.redirect({"method": "POST"}, "/api/calls/recap_previous")
      }
      else if(user && !user.permission){
        twiml.redirect({"method": "POST"}, "/api/calls/prompt_permission")
      }
      else{
        twiml.redirect({"method":"POST"}, "/api/calls/prompt_language")
      }

      // Render the response as XML in reply to the webhook request
      res.setHeader("content-type",'text/xml');
      res.send(twiml.toString());
    })
  }
}

