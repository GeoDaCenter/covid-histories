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

      const previous_answer_entry  = user.responses.find( (r:any) => r.topic_id === topic_id && r.category_id=== category_id )
      const new_answer_entry   = {...previous_answer_entry, transcription_uri, transcription_sid, transcription }
      console.log("POSTING TRANSCRIPTION TO ", number)

      createOrUpdateUserRecord( number, {...user, responses: user.responses.map( (r:any)=> r.topic_id===topic_id && r.category_id===category_id ? new_answer_entry : r  )})
      res.send("ok")
    })

  }
}

