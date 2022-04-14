import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import { prompts } from "./_prompts";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === "POST") {
    console.log("Selected topic ", req.body);
    const twiml = new VoiceResponse();

    const selection = parseInt(req.body.Digits);
    if (selection < prompts.length) {
      twiml.say(
        { voice: "alice" },
        `Thanks! You selected ${prompts[selection].name}. You will now by asked a series of questions, after each one simply answer and press any button when your done to move on.`
      );
      twiml.redirect(
        {method: "POST"},
        `https://covid-histories.vercel.app/api/calls/record_topic?topic_id=${selection}&category_id=0`
      )
    } else {
      twiml.say("Sorry please choose one of the specified options");
      twiml.redirect(
        { method: "POST" },
        "https://covid-histories.vercel.app/api/calls/prompt_topic"
      );
    }
    res.setHeader("content-type", "text/xml");
    res.send(twiml.toString());
  }
  // Render the response as XML in reply to the webhook request
}
