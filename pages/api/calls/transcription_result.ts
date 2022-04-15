import { NextApiRequest, NextApiResponse } from "next";
import { prompts } from "./_prompts";
import { getOrCreateUserRecord, createOrUpdateUserRecord } from "./_s3_utils";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    console.log("Transcription body is ",req.body)
    const number = req.body.From;
    const topic_id = parseInt(req.query.topic_id as string);
    const category_id = parseInt(req.query.category_id as string);
    const section = prompts[topic_id];
    

    getOrCreateUserRecord(number).then(user=>{
      const transcription = req.body.TranscriptionText
      const transcription_uri = req.body.Uri
      const transcription_sid = req.body.Sid 

      const new_user = {...user, transcriptions: [...user.transcriptions, {transcription, transcription_sid, transcription_uri, topic_id, category_id}]}  
      
      console.log('old user ', user )
      console.log('new user ', new_user)

      createOrUpdateUserRecord( number, new_user)
      res.send("ok")
    })

  }
}

