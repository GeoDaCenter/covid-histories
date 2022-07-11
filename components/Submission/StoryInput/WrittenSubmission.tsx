import React, { useState } from 'react'
import { Descendant } from 'slate'
// @ts-ignore
import { serialize } from 'remark-slate'
import { StoryInputProps } from './types'
import { WrittenSubmissionEditor } from './WrittenUtils/WrittenSubmissionEditor'
import { SubmissionDraft } from '../../../stores/indexdb/SubmissionDraft'

const initialValue: Descendant[] = [
	{
		// @ts-ignore
		type: 'paragraph',
		children: [{ text: '' }]
	}
]

export const WrittenSubmission: React.FC<StoryInputProps> = ({
	handleCacheStory,
	storyId,
	dbActive,
	isAdditionalContent = false
}) => {
	const [text, setText] = useState<Descendant[]>(initialValue)
	const handleChange = (newText: Descendant[]) => {
		if (newText) {
			setText(newText)
			// @ts-ignore
			const md = newText.map((v: Descendant) => serialize(v)).join('')
			typeof md === 'string' && handleCacheStory(md)
		}
	}
	const getCachedEntry = isAdditionalContent
		? (entry: SubmissionDraft | undefined) => entry?.additionalContent
		: (entry: SubmissionDraft | undefined) => entry?.content

	return (
		<WrittenSubmissionEditor
			storyId={storyId}
			text={text}
			setText={setText}
			handleChange={handleChange}
			getCachedEntry={getCachedEntry}
			dbActive={dbActive}
		/>
	)
}
