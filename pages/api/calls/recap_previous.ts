import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {getOrCreateUserRecord} from "./_s3_utils";
import {gather, sayOrPlay, VoiceForLanguage} from "./_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {

    getOrCreateUserRecord(req.body.From).then( user=>{
      const twiml = new VoiceResponse();
      sayOrPlay(twiml, "ReviewPrevious", user.language);

      if(user.zipCode){
         sayOrPlay(twiml, "ZipCodeRecap", user.language);
         twiml.say(VoiceForLanguage[user.language || 'en'], user.zipCode!.split("").join(" "))
      }

      gather(twiml, "ZipOrTopicOptions", user.language,{numDigits:1, action:"/api/calls/update_option_selection", bargeIn:true})

      // Render the response as XML in reply to the webhook request
      res.setHeader("content-type",'text/xml');
      res.send(twiml.toString());
    })
  }
}

