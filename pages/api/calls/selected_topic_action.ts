import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import {getUserRecord} from "./_s3_utils";
import {sayOrPlay} from "./_utils";
import { prompts } from "./_prompts";
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
          // Listen to the topic
          case 0:
            twiml.play(previousSubmission.responseAudioUrl);
            twiml.redirect(`/api/calls/topic_options?topic_id=${topic_id}`)
            break

          // Re-record the topic
          case 1:
            sayOrPlay(twiml, "RecordingPrelude", user!.language)
            twiml.redirect(`/api/calls/record_topic?topic_id=${topic_id}`)
            break

          // Delete the topic 
          case 2:
            sayOrPlay(twiml, "DeletedStory", user!.language)
            twiml.redirect(`/api/calls/prompt_topic`)
            break

          // Select another topic 
          case 3:
            twiml.redirect(`/api/calls/prompt_topic`)
            break
          default:
            sayOrPlay(twiml, "MissingOption",user!.language)
            twiml.redirect(`/api/calls/topic_options?topic_id${topic_id}`)
        }
      }

      res.setHeader("content-type", "text/xml");
      res.send(twiml.toString());
    })
  }
  // Render the response as XML in reply to the webhook request
}
