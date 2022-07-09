import { NextApiRequest, NextApiResponse } from "next";
import { prompts } from "./_prompts";
import { createOrUpdateUserRecord, getUserRecord } from "./_s3_utils";
import {UserCallRecord} from "./_types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    console.log("Transcription body is ",req.body)
    const number = req.body.From;
    const topic_id = parseInt(req.query.topicId as string);
    const topic = prompts[topic_id];
    

    getUserRecord(number).then(user=>{
      // const transcription = req.body.TranscriptionText
      // const transcription_uri = req.body.Uri
      // const transcription_sid = req.body.Sid 

      // const new_user: UserCallRecord = {
      //   ...user, 
      //   responses: user.responses.map(
      //     response => response.topic === topic.name ?
      //       {...response, responseTranscriptUrl: transcription_uri} 
      //     : response ) }  
      
      // createOrUpdateUserRecord(number, new_user)
      // res.send("ok")
    })

  }
}

