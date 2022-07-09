import React, { useEffect, useState } from 'react'
import { Descendant } from 'slate'
import { Box } from '@mui/material'
import { unified } from 'unified'
// @ts-ignore
import markdown from 'remark-parse'
import slate from 'remark-slate'
import Editor from './../WrittenUtils/Editor'
import colors from '../../../../config/colors'
import { db } from '../../../../stores/indexdb/db'
import { SubmissionDraft } from '../../../../stores/indexdb/SubmissionDraft'

interface WrittenSubmissionEditorProps {
    storyId: string | undefined
    text: Descendant[]
    setText: (text: Descendant[]) => void
    handleChange: (newText: Descendant[]) => void
    getCachedEntry: (entry: SubmissionDraft | undefined) => string | Blob | undefined
    dbActive: boolean
}

export const WrittenSubmissionEditor: React.FC<WrittenSubmissionEditorProps> = ({
    storyId,
    dbActive,
    text,
    setText,
    handleChange,
    getCachedEntry
}) => {
    const [editorLoader, setEditorLoaded] = useState<Boolean>(false)
    useEffect(() => {
        if (db && storyId?.length) {
            db.submissions.get(0).then((entry) => {
                const cachedContent = getCachedEntry(entry)
                if (cachedContent && typeof cachedContent === 'string') {
                    unified()
                        .use(markdown)
                        .use(slate)
                        .process(cachedContent)
                        .then(({ result }) => {
                            // @ts-ignore
                            setText(result)
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
    }, [dbActive, storyId])  // eslint-disable-line
//  TODO refactor editor directly into this file, clean up components
    return (
        <Box
            sx={{
                minHeight: 400,
                background: colors.darkgray,
                padding: '2em',
                margin: '0 0 2em 0',
                border: `1px solid ${colors.gray}`
            }}
        >
            {editorLoader && <Editor value={text} handleChange={handleChange} />}
        </Box>
    )
}