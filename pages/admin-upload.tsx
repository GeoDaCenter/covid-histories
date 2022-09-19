import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { Box, Button, Modal, Stack, TextField } from '@mui/material'
import React, { useCallback, useState, useEffect } from 'react'
import { SEO } from '../components/Interface/SEO'
import { SubmissionForm } from '../components/Submission/SubmissionUtil/SubmissionForm'
import { store } from '../stores/submission'
import { Provider } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectConsent,
    selectCounty,
    selectOptInResearch,
    selectTitle,
    selectType,
    selectTheme,
    selectTags,
} from '../stores/submission'
import {
	selectSelfIdentifiedRace,
	selectPerceivedIdentifiedRace,
	selectGenderIdentity,
	selectAge,
	selectPlaceUrbanicity,
	selectAdditionalDescription,
} from '../stores/survey'

import { nanoid } from '@reduxjs/toolkit'
import { YourCovidExperience } from '../components/Submission/Steps'
import { Survey } from '../components/Submission/Steps'
import { useDropzone } from 'react-dropzone'
import colors from '../config/colors'
import objectHash from 'object-hash'
// helpers
const str2blob = (txt: string): Blob =>
    new Blob([txt], { type: 'text/markdown' })

interface UploadSpec {
    fileType: string
    key: string
    email: string
    folder: string
}
    
const getSubmissionUrl = async (uploadSpec: UploadSpec): Promise<string> => {
    const { fileType, key, email, folder } = uploadSpec

    const response = await fetch(
        `/api/admin/upload?key=${encodeURIComponent(key)}
            &fileType=${encodeURIComponent(fileType)}
            &email=${encodeURIComponent(email)}
            &folder=${encodeURIComponent(folder)}`,
    ).then((res) => res.json())

    return response?.uploadURL
}

const AdminInner: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [storyId] = useState(nanoid())

    const storyType = useSelector(selectType)
    const title = useSelector(selectTitle)
    const county = useSelector(selectCounty)
    const consent = useSelector(selectConsent)
    const optInResearch = useSelector(selectOptInResearch)
    const theme = useSelector(selectTheme)
    const tags = useSelector(selectTags)
    const dispatch = useDispatch()
    const [tab, setTab] = React.useState(0)
    const [content, setContent] = useState<any | null>(null)
    const [additionalContent, setAdditionalContent] = useState<any | null>(null)
	const selfIdentifiedRace = useSelector(selectSelfIdentifiedRace)
	const selfIdentifiedRaces = selfIdentifiedRace.map((race) => race.name)
	const perceivedIdentifiedRace = useSelector(selectPerceivedIdentifiedRace)
	const perceivedRaces = perceivedIdentifiedRace.map((race) => race.name)
	const genderIdentity = useSelector(selectGenderIdentity)
	const age = useSelector(selectAge)
	const placeUrbanicity = useSelector(selectPlaceUrbanicity)
	const additionalDescription = useSelector(selectAdditionalDescription)

    const handleSendFile = async (blob: Blob, url: string) => {
        return await fetch(url, {
            method: 'PUT',
            body: blob
        }).then(r => console.log(r))
    }

    const [fileSource, setFileSource] = useState({ url: '', type: '', name: '' })
    
    const onDrop = useCallback((acceptedFiles: any[]) => {
        const urlObject = URL.createObjectURL(acceptedFiles[0])
        setFileSource({ 
            name: acceptedFiles[0].path,
            url: urlObject,
            type: acceptedFiles[0].type
        })
    }, []) // eslint-disable-line

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    })

    const handleSubmit = async () => {
        try {
            setIsUploading(true)
            // story meta
            const meta = {
                title,
                fips: county?.value,
                consent,
                optInResearch,
                storyId,
                storyType,
                theme,
                tags,
                date: new Date().toISOString(),
                email: userEmail
            }
            const metaBlob = str2blob(JSON.stringify(meta))
            const metaUploadSpec = {
                fileType: 'application/json',
                key: `${storyId}_meta.json`,
                email: userEmail,
                folder: "uploads"
            }
            const metaUploadURL = await getSubmissionUrl(metaUploadSpec)
            await handleSendFile(metaBlob, metaUploadURL)
            // survey
            const survey = {
				email: userEmail,
				selfIdentifiedRace,
				perceivedIdentifiedRace,
				genderIdentity,
				age,
				placeUrbanicity,
				additionalDescription
			}

            const surveyBlob = str2blob(JSON.stringify(survey))
            const surveyUploadSpec = {
                fileType: 'application/json',
                key: `survey.json`,
                email: userEmail,
                folder: "meta"
            }
            const surveyUploadURL = await getSubmissionUrl(surveyUploadSpec)
            await handleSendFile(surveyBlob, surveyUploadURL)

            // story content
            const data = await fetch(fileSource.url).then((r) => r.blob())
            const contentBlob = new Blob([data], { type: fileSource.type })
            const contentUploadSpec = {                
                key: `${storyId}.${fileSource.name.split('.').pop()}`,
                folder: "uploads",
                fileType: contentBlob.type,
                email: userEmail
            }
            const contentUploadUrl = await getSubmissionUrl(contentUploadSpec)
            await handleSendFile(contentBlob, contentUploadUrl)
        } catch {
            alert('upload failed')
        }
    }

    return (
        <div className={styles.container} style={{ padding: '1em' }}>
            <SEO title="Admin" />
            <Modal open={isUploading}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    background:'black',
                    padding: '2em',
                    transform: 'translate(-50%, -50%)',
                }}>
                    <h3>Uploading...</h3>
                </Box>
            </Modal>
            <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
                <Stack direction="column" spacing={3} justifyContent="center" alignItems="center">
                    <h1>Admin Upload</h1>
                    <h2>Email</h2>
                    <TextField 
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <h2>File</h2>

                    {!!fileSource?.url && (
                        <Box>
                            <p>
                                {fileSource.name} ({fileSource.type})
                            </p>
                        </Box>
                    )}
                    <Button
                        {...getRootProps()}
                        sx={{
                            border: `1px solid ${colors.yellow}`,
                            textTransform: 'none',
                            width: '100%',
                            minHeight: '100px'
                        }}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>
                                <span className="material-icons">input</span>
                                <br />
                                Drop your file here.
                                <br />
                                <br />
                            </p>
                        ) : (
                            <p>
                                <span className="material-icons">input</span>
                                <br />
                                Drag and drop your file here, or click to select files.
                                <br />
                            </p>
                        )}
                    </Button>
                    <h2>Topic</h2>
                    <YourCovidExperience quiet />
                    <h2>Submission Info</h2>
                    <SubmissionForm
                        handleNext={() => { }}
                        storyId={storyId}
                        quiet
                    />
                    <h2>Survey</h2>
                    {/* @ts-ignore */}
                    <Survey
                        allowSubmit={false}
                        isAdmin={true}
                    />
                    <Button 
                        variant="contained"
                        onClick={() => handleSubmit().then(() => setIsUploading(false))}
                    >
                        Submit
                    </Button>
                </Stack>
            </Box>
        </div>
    )
}
const AdminOuter: NextPage<{ accessToken: string }> = ({ accessToken }) => {
    return <Provider store={store}>
        <AdminInner />
    </Provider>
}

export default withPageAuthRequired(AdminOuter)
