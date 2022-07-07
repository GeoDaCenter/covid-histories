//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getFileList, getSubmissionCounts } from './utils'
import hash from 'object-hash'
import { FileListReturn } from './types'

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	// @ts-ignore
	const { user } = getSession(req, res)
	if (user) {			
		const encrypted = hash(user.email)
		const prefix = `meta/${encrypted}`
        const metaCounts = await getSubmissionCounts(prefix)
        
		res.status(200).json(
			JSON.stringify(metaCounts)
		)
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
