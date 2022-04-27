import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { Descendant } from 'slate'
import { unified } from 'unified'
// @ts-ignore
import markdown from 'remark-parse'
import slate, { deserialize, serialize } from 'remark-slate'
import Editor from './WrittenUtils/Editor'
import colors from '../../../config/colors'
import { StoryInputProps } from './types'
import { db } from '../../../stores/indexdb/db'
import { useDispatch, useSelector } from 'react-redux'
import { useSelect } from '@mui/base'

const initialValue: Descendant[] = [
	{
		// @ts-ignore
		type: 'paragraph',
		children: [{ text: 'Write your story here...' }]
	}
]

export const WrittenSubmission: React.FC<StoryInputProps> = ({
	handleCacheStory,
	storyId,
	handleNext,
	handleRetrieveStory,
	dbActive
}) => {
	const dispatch = useDispatch()
	const [text, setText] = useState<Descendant[]>(initialValue)
	const [editorLoader, setEditorLoaded] = useState<Boolean>(false)
	useEffect(() => {
		if (db && storyId?.length) {
			db.submissions.get(0).then((entry) => {
				if (entry?.content) {
					unified()
						.use(markdown)
						.use(slate)
						.process(entry.content)
						.then(({ result }) => {
							// @ts-ignore
							setText(result)
							console.log('result', result)
							setEditorLoaded(true)
						})
						.catch((err) => {
							console.log(err)
							setEditorLoaded(true)
						})
				} else {
					setEditorLoaded(true)
				}
			})
		}
	}, [dbActive, storyId])

	const handleChange = (newText: Descendant[]) => {
		if (newText) {
			setText(newText)
			// @ts-ignore
			const md = newText.map((v: Descendant) => serialize(v)).join('')
			typeof md === 'string' && handleCacheStory(md)
		}
	}

	// useEffect(() => {
	//   const prevStory = handleRetrieveStory()
	// }, [storyId, dbActive])

	return (
		<Box
			sx={{
				minHeight: 400,
				background: colors.darkgray,
				padding: '2em',
				margin: '0 0 2em 0',
				border: `1px solid ${colors.orange}`
			}}
		>
			{editorLoader && <Editor value={text} handleChange={handleChange} />}
		</Box>
	)
}
