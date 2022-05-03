import React, { useEffect, useState } from 'react'
import { SubmissionTypes } from '../../stores/submission/submissionSlice'
import { db, resetDatabase } from '../../stores/indexdb/db'
import { Box } from '@mui/material'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'

const Container = styled(Box)`
	max-width: 100%;
	* {
		max-width: 100%;
	}
`
// @ts-ignore
export const StoryPreview: React.FC<{ type: SubmissionTypes }> = ({ type }) => {
	const [content, setContent] = useState<any | null>(null)
	const [additionalContent, setAdditionalContent] = useState<any | null>(null)
	useEffect(() => {
		const getContent = async () => {
			const entry = await db.submissions.get(0)

			if (entry?.content) {
				switch (type) {
					case 'written':{
						setContent(entry.content)
						return
                    }
					case 'photo':{
						// @ts-ignore
						const tempUrl = URL.createObjectURL(entry.content)
						setContent(tempUrl)
                        setAdditionalContent(entry.additionalContent)
						return
                    }
					case 'video': {
						// @ts-ignore
						const tempUrl = URL.createObjectURL(entry.content)
						setContent(tempUrl)
						return
                    }
					default:
						return
				}
			}
		}
		getContent()
	}, [type])
	if (!content) return null

	switch (type) {
		case 'video':
			return (
				<Container>
					<video src={content} controls />
				</Container>
			)
			break
		case 'written':
			return (
				<Container>
					<Box
						sx={{
							border: '1px solid white',
							padding: '0 1em'
						}}
					>
						<ReactMarkdown>{content}</ReactMarkdown>
					</Box>
				</Container>
			)
			break
		case 'photo':
			return (
				<Container>
                    <Box>
                        <img src={content} alt="story" />
                    </Box>
					<Box
						sx={{
							border: '1px solid white',
							padding: '0 1em',
							maxHeight: '50vh',
							overflowY: 'auto'
						}}
					>
						<ReactMarkdown>{additionalContent}</ReactMarkdown>
					</Box>
				</Container>
			)
			break
		default:
			return null
	}
}
