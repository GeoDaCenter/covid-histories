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
export interface PresignedGetOutput {
	fileType: string;
	url: string;
	fileName: string;
	ContentType: string | null
}

const WrittenStory: React.FC<{ content: string | PresignedGetOutput | null }> = ({ content }) => {
	const fetcher = typeof content !== 'string' && content?.url
		? (content: PresignedGetOutput) => fetch(content.url).then((r) => r.text())
		: () => content
	const { data } = useSWR(content, fetcher)
	const text = data as string
	return <ReactMarkdown>{text}</ReactMarkdown>
}

// @ts-ignore
export const StoryPreview: React.FC<{
	type: SubmissionTypes
	content: string | PresignedGetOutput | null | undefined
	additionalContent: any | null
}> = ({ type, content, additionalContent }) => {
	if (!content) return null
	switch (type) {
		case 'video': {
			const contentUrl = typeof content === 'string' ? content : content.url
			return (
				<Container>
					<video src={contentUrl} controls />
				</Container>
			)
			break
		}
		case 'audio': {
			const contentUrl = typeof content === 'string' ? content : content.url
			return (
				<Container>
					<audio src={contentUrl} controls />
				</Container>
			)
			break
		}
		case 'phone': {
			const contentUrl = typeof content === 'string' ? content : content.url
			return (
				<Container>
					<audio src={contentUrl} controls />
				</Container>
			)
			break
		}
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
		case 'photo': {
			const contentUrl = typeof content === 'string' ? content : content.url
			return (
				<Container>
					<Box>
						<img src={contentUrl} alt="story" />
					</Box>
					<Box
						sx={{
							border: '1px solid white',
							padding: '0 1em',
							maxHeight: '50vh',
							overflowY: 'auto'
						}}
					>
					<WrittenStory content={additionalContent} />
					</Box>
				</Container>
			)
			break
		}
		default:
			return null
	}
}
