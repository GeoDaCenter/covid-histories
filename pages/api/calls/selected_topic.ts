import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import { defaultVoice, FirstRecording, PreviousRecording, prompts } from "./_prompts";
import {getPreviousCalls, getUserRecord} from "./_s3_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === "POST") {

    const number = req.body.From;
    getUserRecord(number).then((user)=>{
      getPreviousCalls(number).then(previousCalls=>{
        const twiml = new VoiceResponse();    
        const selectedOption= parseInt(req.body.Digits)-1;
        const selectedTopic = prompts[selectedOption] 

        const previousSubmission=  previousCalls.find(response=> response.topicId === selectedTopic.name)

        if (selectedOption< prompts.length) {
          
          twiml.say(
            defaultVoice,
            `Thanks! You selected ${selectedTopic.name}`
          );
           if(previousSubmission){
             // If the user has previously sumbitted a recording, 
             // give them options
              twiml.redirect(
                {method: "POST"},
                `/api/calls/prompt_topic_options?topic_id=${selectedOption}`
              )
           }
           else{
              twiml.say(defaultVoice, FirstRecording)
              twiml.redirect(
                {method: "POST"},
                `/api/calls/record_topic?topic_id=${selectedOption}`
              )

           }
        } else {
          twiml.say("Sorry please choose one of the specified options");
          twiml.redirect(
            { method: "POST" },
            "/api/calls/prompt_topic"
          );
        }
        res.setHeader("content-type", "text/xml");
        res.send(twiml.toString());

      })
    })
  }
  // Render the response as XML in reply to the webhook request
}
