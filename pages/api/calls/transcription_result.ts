import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
    console.log("Transcription response is ", req, req.query, req.body)
  }
}

