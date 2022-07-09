//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import hash from 'object-hash'
// AWS
import { uploadMeta } from '../files/utils'

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { body } = req
  const session = getSession(req, res)
  const user = session?.user

  if (user) {
    const hashedEmail = hash(user.email)
    const key = 'meta/' + hashedEmail + '/' + 'survey.json'
    const metaResult = await uploadMeta(null, key, body)
    if (!metaResult) {
      res.status(500).json(
        JSON.stringify({
          error: 'The server failed to upload, please try again.'
        })
      )
    } else {
      res.status(200).json(
        JSON.stringify({
          success: true
        })
      )
    }
  } else {
    // Not Signed in
    res.status(401).json(
      JSON.stringify({
        error: 'Not Signed In'
      })
    )
  }
  res.end()
})
