import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { createOrUpdateUserRecord, getUserRecord } from './_s3_utils'
import { zip_to_counties } from '../../../utils/zip_to_counties'
import { sayOrPlay } from './_utils'

const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method === 'POST') {
		const twiml = new VoiceResponse()
		getUserRecord(req.body.From).then((user) => {
			const zip = req.query.zip
			const potential_counties = zip_to_counties(zip as string)
			const selection = parseInt(req.body.Digits) - 1

			if (selection > potential_counties.length) {
				sayOrPlay(twiml, 'MissingOption', user.language)
				twiml.redirect('/api/calls/prompt_zipcode')
			} else {
				sayOrPlay(twiml, 'Thanks', user.language)
				createOrUpdateUserRecord(req.body.From, user, {
					county: potential_counties[selection].CountyName
				})
				twiml.redirect('/api/calls/prompt_topic')
			}

			// Render the response as XML in reply to the webhook request
			res.setHeader('content-type', 'text/xml')
			res.send(twiml.toString())
		})
	}
}
