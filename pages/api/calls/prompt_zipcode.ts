import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {getOrCreateUserRecord} from "./_s3_utils";
import {gather, sayOrPlay} from "./_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    getOrCreateUserRecord(req.body.From).then( user=>{

      const twiml = new VoiceResponse();

      gather(twiml, "ZipCodePrompt", user.language, {numDigits:5, action:"/api/calls/verify_county", bargeIn:true})  
      sayOrPlay(twiml, "ZipCodeNoReply", user.language)

      // Render the response as XML in reply to the webhook request
      res.setHeader("content-type",'text/xml');
      res.send(twiml.toString());
    })
  }
}

