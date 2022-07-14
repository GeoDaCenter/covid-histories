import { GetObjectCommand } from '@aws-sdk/client-s3'
import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import { config, s3 } from '../files/_s3'
import { prompts } from './_prompts'
import { deleteStory, getPreviousCalls, getUserRecord, hashPhoneNo } from './_s3_utils'
import { sayOrPlay } from './_utils'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const VoiceResponse = twilio.twiml.VoiceResponse

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method === 'POST') {
		const number = req.body.From
		getUserRecord(number).then((user) => {
			getPreviousCalls(number).then((previousCalls) => {
				console.log('Previous calls ', previousCalls)
				const twiml = new VoiceResponse()
				const selectedAction = parseInt(req.body.Digits) - 1
				const topicId = parseInt(req.query.topicId as string)

				const selectedTopic = prompts[topicId]
				console.log('Previous calls as ', previousCalls)

				const previousSubmission = previousCalls.find(
					(response) => response.topicId === selectedTopic.name
				)
				if (previousSubmission) {
					const s3Params = new GetObjectCommand({
						Bucket: config.S3_BUCKET,
						Key: `uploads/${hashPhoneNo(
							req.body.From
						)}/${previousSubmission.key.replace('_meta.json', '.wav')}`
					})

					getSignedUrl(s3, s3Params, { expiresIn: 600 }).then(
						(audioUrl: string) => {
							switch (selectedAction) {
								// Listen to the topic
								case 0:
									twiml.play(audioUrl)
									twiml.redirect(
										`/api/calls/prompt_topic_options?topicId=${topicId}`
									)
									break

								// Re-record the topic
								case 1:
                  deleteStory(number,previousSubmission.key)
									sayOrPlay(twiml, 'RecordingPrelude', user!.language)
									twiml.redirect(`/api/calls/record_topic?topicId=${topicId}`)
									break

								// Delete the topic
								case 2:
                  deleteStory(number,previousSubmission.key)
									sayOrPlay(twiml, 'DeletedStory', user!.language)
									twiml.redirect(`/api/calls/prompt_topic`)
									break

								// Select another topic
								case 3:
									twiml.redirect(`/api/calls/prompt_topic`)
									break
								default:
									sayOrPlay(twiml, 'MissingOption', user!.language)
									twiml.redirect(
										`/api/calls/prompt_topic_options?topicId${topicId}`
									)
							}

							res.setHeader('content-type', 'text/xml')
							res.send(twiml.toString())
						}
					)
				}
			})
		})
	}
}
