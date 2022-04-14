import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {prompts} from "./_prompts"
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {

    const twiml = new VoiceResponse();
    twiml.play("https://covid-histories.vercel.app/inital_prompt.mp3")

    twiml.say({ voice: 'alice' }, 'To begin select a category to tell us about');

    let option_prompt= prompts.map((prompt,index)=>{
      `For ${prompt.name} press ${index}`
    }).join(", ");

    twiml.gather({numDigits:1, action:"https://covid-histories.vercel.app/api/calls/selected_topic", bargeIn:true}).say({voice:"alice"}, option_prompt);


    twiml.record({
      action:"https://covid-histories.vercel.app/api/calls/record_result",
      transcribeCallback: "https://covid-histories.vercel.app/api/calls/transcription_result",
      maxLength:60,
      method:"POST"
    })

    // Render the response as XML in reply to the webhook request
    res.setHeader("content-type",'text/xml');
    res.send(twiml.toString());
  }
}

