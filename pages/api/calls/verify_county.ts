import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { Prompts } from './_prompts'
import { createOrUpdateUserRecord, getUserRecord } from './_s3_utils'
import { zip_to_counties } from '../../../utils/zip_to_counties'
import { sayOrPlay, VoiceForLanguage } from './_utils'

const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method === 'POST') {
		const twiml = new VoiceResponse()
		getUserRecord(req.body.From).then((user) => {
			const zip = req.body.Digits
			const potential_counties = zip_to_counties(zip)

			if (potential_counties.length === 1) {
				twiml.say(
					`thanks, that means you are in ${potential_counties[0].CountyName} county.`
				)
				twiml.redirect('/api/calls/prompt_topic')
			}

			if (potential_counties.length === 0) {
				sayOrPlay(twiml, 'CountyNotFound', user.language)
				createOrUpdateUserRecord(req.body.From, user, {
					county: potential_counties[0].CountyFIPS
				})
				twiml.redirect('/api/calls/prompt_zipcode')
			}

			if (potential_counties.length > 1) {
				sayOrPlay(twiml, 'WhatCountyAreYouPartOf', user.language)

				//TODO add readout for this
				const prompt = potential_counties
					.map((county, index) => {
						const prefixKey = [
							'PressOneFor',
							'PressTwoFor',
							'PressThreeFor',
							'PressFourFor',
							'PressFiveFor'
						]
						//@ts-ignore
						const prefix = Prompts[prefixKey[index]][user.language].text

						return `${prefix} ${county.CountyName}`
					})
					.join(',')

				twiml
					.gather({
						numDigits: 1,
						action: `/api/calls/selected_county?zip=${zip}`,
						bargeIn: true
					})
					//@ts-ignore
					.say(VoiceForLanguage[user.language], prompt)
			}

			// Render the response as XML in reply to the webhook request
			res.setHeader('content-type', 'text/xml')
			res.send(twiml.toString())
		})
	}
}
