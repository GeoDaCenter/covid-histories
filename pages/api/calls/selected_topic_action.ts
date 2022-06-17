import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import { defaultVoice, FirstRecording, PreviousRecording, prompts } from "./_prompts";
import {getUserRecord} from "./_s3_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === "POST") {

    const number = req.body.From;
    getUserRecord(number).then((user)=>{
      const twiml = new VoiceResponse();    
      const selectedAction= parseInt(req.body.Digits)-1;
		  const topic_id = parseInt(req.query.topic_id as string)

      const selectedTopic = prompts[topic_id] 

      const previousSubmission= user?.responses.find(response=> response.topic === selectedTopic.name)
      if(previousSubmission){

        switch(selectedAction){
          case 0:
            twiml.play(previousSubmission.responseAudioUrl);
            twiml.redirect(`/api/calls/topic_options?topic_id=${topic_id}`)
            break
          case 1:
            twiml.say(defaultVoice, "We have deleted your story");
            twiml.redirect(`/api/calls/prompt_topic`)
            break
          case 2:
            twiml.redirect(`/api/calls/prompt_topic`)
            break
          default:
            twiml.say(defaultVoice,"Sorry I didn't get that option")
            twiml.redirect(`/api/calls/topic_options?topic_id${topic_id}`)
        }
      }

      res.setHeader("content-type", "text/xml");
      res.send(twiml.toString());
    })
  }
  // Render the response as XML in reply to the webhook request
}
