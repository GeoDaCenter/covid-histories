
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {prompts} from "./_prompts"
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
  
    console.log("Selected topic ", req.body)
    const twiml = new VoiceResponse();

    
    twiml.play("https://covid-histories.vercel.app/inital_prompt.mp3")

    twiml.say({ voice: 'alice' }, `You selected ${1}. You will now by asked a series of questions, after each one simply answer and press any button when your done to move on.`);



    // Render the response as XML in reply to the webhook request
    res.setHeader("content-type",'text/xml');
    res.send(twiml.toString());
  }
}


