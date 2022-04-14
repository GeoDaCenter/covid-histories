import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import { prompts } from "./_prompts";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === "POST") {
    console.log("Selected topic ", req.body, req.query);
    const twiml = new VoiceResponse();

    const selection = parseInt(req.query.topic_id as string);
    const category= parseInt(req.query.category_id as string);
    const section = prompts[selection]
    if(category < section.categories.length){
      twiml.say(section.categories[category])
      twiml.record({maxLength:60, finishOnKey:"#", action:`https://covid-histories.vercel.app/api/calls/record_topic?topic_id=${selection}&category_id=${category+1}`})
    }
    else{
      twiml.say("Thanks for submitting your entry. Select another topic to record another story or simply hangup to end your submission")
      twiml.redirect({method:"POST"}, "https://covid-histories.vercel.app/api/calls/prompt_topic" )
    }

    res.setHeader("content-type", "text/xml");
    res.send(twiml.toString());
  }
  // Render the response as XML in reply to the webhook request
}
