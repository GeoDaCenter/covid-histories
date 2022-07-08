// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getOrCreateUserRecord } from './calls/_s3_utils'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  getOrCreateUserRecord('+13123940797')
    .then((user: any) => {
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(200).json(err)
    })
}
