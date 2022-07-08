import React, { useEffect, useState } from 'react'
import { SubmissionTypes } from '../../stores/submission/submissionSlice'
import { db, resetDatabase } from '../../stores/indexdb/db'
import { Box } from '@mui/material'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import useSWR from 'swr'

const Container = styled(Box)`
	max-width: 100%;
	* {
		max-width: 100%;
	}
`

const WrittenStory: React.FC<{content: string}> = ({ content }) => {
	const fetcher = content.slice(0,5) === 'https' ? (content:string) => fetch(content).then(r => r.text()) : () => content
	const { data } = useSWR(content, fetcher)
	const text = data as string
	return <ReactMarkdown>{text}</ReactMarkdown>
}
// @ts-ignore
export const StoryPreview: React.FC<{ type: SubmissionTypes, content: any|null, additionalContent: any|null }> = ({ type, content, additionalContent }) => {
	if (!content) return null
	switch (type) {
		case 'video':
			return (
				<Container>
					<video src={content} controls />
				</Container>
			)
			break
		case 'audio':
			return (
				<Container>
					<audio src={content} controls />
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
						<WrittenStory content={content} />
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
