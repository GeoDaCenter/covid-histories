//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getFileList, listFiles } from './utils'

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {

	// @ts-ignore
	const { user } = getSession(req, res)
	if (user) {			
    const {numberOfSubmissions,fileNames} = await listFiles(user.email);
		res.status(200).json(
			JSON.stringify({
				numberOfSubmissions,
                fileNames
			})
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
