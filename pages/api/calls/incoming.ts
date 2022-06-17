import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {Welcome,defaultVoice} from "./_prompts"
import { getOrCreateUserRecord, createOrUpdateUserRecord } from "./_s3_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    getOrCreateUserRecord(req.body.From).then(user=>{
      const twiml = new VoiceResponse();
      twiml.say(defaultVoice, Welcome);

      if(user.zipCode !== undefined || user.responses.length>0){
        twiml.redirect({"method": "POST"}, "/api/calls/recap_previous")
      }
      else{
        twiml.redirect({"method": "POST"}, "/api/calls/prompt_zipcode")
      }

      // Render the response as XML in reply to the webhook request
      res.setHeader("content-type",'text/xml');
      res.send(twiml.toString());
    })
  }
}

