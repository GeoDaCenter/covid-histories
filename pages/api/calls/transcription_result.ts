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
    const selection = parseInt(req.query.topic_id as string);
    const category = parseInt(req.query.category_id as string);
    const section = prompts[selection];
    

    getOrCreateUserRecord(number).then(user=>{
      const transcription = req.body.TranscriptionText
      const transcription_uri = req.body.Uri
      const transcription_sid = req.body.Sid 

      const previous_answer_entry  = user.responses.find( (r:any) => r.topic === section && r.category === category )
      const new_answer_entry   = {...previous_answer_entry, transcription_uri, transcription_sid }

      createOrUpdateUserRecord( {...user, responses: user.responses.map( (r:any)=> r.topic===section && r.category===category ? new_answer_entry : r  )})
      res.send("ok")
    })

  }
}

