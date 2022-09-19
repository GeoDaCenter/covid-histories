import {
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectConsent,
    selectCounty,
    selectOptInResearch,
    selectTitle,
    selectType,
    setCounty,
    setTitle,
    toggleConsent,
    toggleOptInResearch,
    setUploadProgress,
    selectTheme,
    selectTags,
    setTags
} from '../../../stores/submission'
import { db, resetDatabase } from '../../../stores/indexdb/db'
import { CountySelect } from '../SubmissionUtil/CountySelect'
import { TagSelect } from '../SubmissionUtil/TagSelect'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0'
import colors from '../../../config/colors'

interface SubmissionFormProps {
    handleNext: () => void,
    storyId: string,
    customHandleSubmit?: () => void,
    setIsUploading?: (isUploading: boolean) => void,
    quiet?: boolean
}

interface UploadSpec {
    storyType: string
    fileType: string
    storyId: string
}

interface MetaSpec {
    title: string | null,
    fips: number,
    consent: boolean,
    optInResearch: boolean
    storyId: string,
    storyType: 'video' | 'audio' | 'written' | 'photo' | 'phone',
    theme: string,
    tags: string[],
    date: string,
    email: string
}

// helpers
const str2blob = (txt: string): Blob =>
    new Blob([txt], { type: 'text/markdown' })

const getSubmissionUrl = async (uploadSpec: UploadSpec): Promise<string> => {
    const { storyType, fileType, storyId } = uploadSpec

    const response = await fetch(
        `/api/files/request_upload?storyType=${encodeURIComponent(
            storyType
        )}&storyId=${encodeURIComponent(storyId)}&fileType=${encodeURIComponent(
            fileType
        )}`
    ).then((res) => res.json())
    return response?.uploadURL
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
    storyId,
    handleNext,
    customHandleSubmit,
    setIsUploading = (isUploading: boolean) => { },
    quiet
}) => {
    const storyType = useSelector(selectType)
    const title = useSelector(selectTitle)
    const county = useSelector(selectCounty)
    const consent = useSelector(selectConsent)
    const optInResearch = useSelector(selectOptInResearch)
    const theme = useSelector(selectTheme)
    const tags = useSelector(selectTags)
    const canSubmit = consent && county?.label?.length
    const { user } = useUser()
    const dispatch = useDispatch()
    const handleConsent = () => dispatch(toggleConsent())
    const handleOptInResearch = () => dispatch(toggleOptInResearch())
    const handleTag = (tags: string[]) => {
        dispatch(setTags(tags))
    }
    const handleTitle = (text: string) => dispatch(setTitle(text))
    const handleCounty = (
        _e: React.SyntheticEvent,
        county: { label: string; value: number }
    ) => {
        if (county?.label) {
            dispatch(setCounty(county))
        } else {
            dispatch(setCounty({ label: '', value: -1 }))
        }
    }
    // handlers for uploads
    const handleSuccessfulUpload = () => {
        setIsUploading(false)
        handleNext()
        resetDatabase({
            storyId: ''
        })
    }
    const handleFailedUpload = () => {
        setIsUploading(false)
        console.log('upload failed try again')
    }
    const handleSendFile = (blob: Blob, url: string, quiet: boolean = false) => {
        !quiet && setIsUploading(true)
        let request: XMLHttpRequest = new XMLHttpRequest()
        request.open('PUT', url)
        request.upload.addEventListener('progress', function (e) {
            let percent_completed: number = (e.loaded / e.total) * 100
            !quiet && dispatch(setUploadProgress(percent_completed))
        })
        request.addEventListener('load', () => {
            !quiet && handleSuccessfulUpload()
        })
        request.send(blob)
    }

    const handleSubmit = customHandleSubmit
        ? customHandleSubmit
        : async () => {
            try {
                const entry = await db.submissions.get(0)

                if (entry?.content) {
                    if (entry?.additionalContent) {
                        const blob = str2blob(entry.additionalContent)
                        const additionalContentUploadSpec = {
                            storyType: storyType,
                            fileType: blob.type,
                            storyId: storyId
                        }
                        const additionalContentURL = await getSubmissionUrl(
                            additionalContentUploadSpec
                        )
                        if (additionalContentURL) {
                            handleSendFile(blob, additionalContentURL, true)
                        }
                    }
                    const email = user!.email!
                    const meta: MetaSpec = {
                        title,
                        fips: county?.value,
                        consent,
                        optInResearch,
                        storyId,
                        storyType,
                        theme,
                        tags,
                        date: new Date().toISOString(),
                        email
                    }

                    const metaBlob = str2blob(JSON.stringify(meta))
                    const metaUploadSpec = {
                        storyType: storyType,
                        fileType: 'application/json',
                        storyId: storyId
                    }
                    const metaUploadURL = await getSubmissionUrl(metaUploadSpec)
                    if (metaUploadURL) {
                        handleSendFile(metaBlob, metaUploadURL, true)
                    }

                    const contentBlob =
                        typeof entry.content === 'string'
                            ? str2blob(entry.content)
                            : entry.content

                    const contentUploadSpec = {
                        storyType: storyType,
                        fileType: contentBlob.type,
                        storyId: storyId
                    }
                    const contentUploadUrl = await getSubmissionUrl(contentUploadSpec)
                    if (contentUploadUrl) {
                        handleSendFile(contentBlob, contentUploadUrl)
                    }
                }
            } catch {
                handleFailedUpload()
            }
        }

    return <>
        {!quiet && <Typography variant="h2" sx={{ marginBottom: '.5em' }}>
            Submit Your Story
        </Typography>}
        <CountySelect onChange={handleCounty} value={county} />
        <TextField
            label="What would you like to title your story? (optional)"
            value={title}
            onChange={(e) => handleTitle(e.target.value)}
            fullWidth
            sx={{ margin: '1rem 0' }}
        />
        <TagSelect onChange={handleTag} tags={tags} />
        <Typography>By submitting your story, you agree that:</Typography>
        <ul>
            <li>
                <Typography>You are over 18</Typography>
            </li>
            <li>
                <Typography>We can publish your story</Typography>
            </li>
            <li>
                <Typography>
                    You agree to the{' '}
                    <Link href="/license">
                        <a target="_blank" style={{ textDecoration: 'underline' }}>
                            full license terms
                        </a>
                    </Link>
                </Typography>
            </li>
        </ul>
        <Typography>
            You get to keep your story, and use it however you’d like. At any
            time you want to remove it, come back here, login, and mark the
            story for removal.
        </Typography>
        <FormGroup sx={{ pb: 2 }}>
            <FormControlLabel
                control={<Checkbox onChange={handleConsent} checked={consent} sx={{ color: colors.yellow }} />}
                label="I agree to the license terms"
                sx={{ color: colors.yellow }}
            />
            <label id="combo-box-county-label" style={{ color: colors.yellow }}>* required</label>
        </FormGroup>
        <Typography>
            If you’d like to be considered for paid research opportunities in
            the future. If I am selected to participate, I would receive $50
            compensation for my time.
        </Typography>
        <FormGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        onChange={handleOptInResearch}
                        checked={optInResearch}
                    />
                }
                label="I want to participate in future research"
            />
        </FormGroup>
        {!quiet && <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit}
            sx={{ marginTop: '1rem', textTransform: 'none' }}
        >
            Submit
        </Button>}
    </>
} 