//  Next + auth
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { deleteStory } from './utils'

export default withApiAuthRequired(async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	// @ts-ignore
	const { user } = getSession(req, res)
	const storyId = req.body

	if (user && storyId) {
		let deleteResult = await deleteStory(user.email, storyId)
		if (deleteResult.result === 'AllDeleted') {
			res.status(200).json(
				JSON.stringify({
					message: `Successfully deleted files for ${storyId}. ${deleteResult?.filesDeleted} files deleted.`
				})
			)
		} else if (deleteResult.result === 'FailedToDelete') {
			res.status(500).json(
				JSON.stringify({
					message: `Error deleting files for ${storyId}. ${deleteResult.filesRemaining} remain. Please contact uscovidatlas@gmail.com`
				})
			)
		} else {
			res.status(500).json(
				JSON.stringify({
					message: `Error deleting files for ${storyId}. No files to delete. Please contact uscovidatlas@gmail.com`
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
