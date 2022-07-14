import axios from 'axios'
// @ts-ignore
import * as Papa from 'papaparse'
import 'dotenv/config'
import {
	getPresignedUrl,
	listFiles,
	listMeta,
	listUsers
} from '../pages/api/files/utils'
import { findCounty } from '../utils/findCounty'

const raceOptions = [
	'Asian / Pacific Islander',
	'Hispanic / Latino',
	'Black / African American',
	'Native American / Alaskan Native',
	'White',
	'Multiracial or Biracial',
	'Other'
]

interface SurveyRow {
	email: string
	id: string
	opted_in: boolean
	opted_in_date: string
	gender: string
	urbanicity: string
	age: number
	submission_ids: string
    submission_fips: string
	submission_counties: string
    additionalDescription?: string
	self_race?: string
    perc_race?: string
}

const getUserInfo = async (userId: string) => {
	const survey = await getPresignedUrl({
		Key: `meta/${userId}/survey.json`,
		operation: 'getObject'
	})
        .then((response) => axios(response.url)
        .then((res) => res.data))
        .catch((err) => ({
            error: err,
            nosurvey:true
        }))

    const subMeta = await listMeta(userId)    
	const subs = subMeta 
        ? await Promise.all(
            subMeta.map(
                ({ Key }) =>
                    getPresignedUrl({ Key: `uploads/${userId}/${Key}`, operation: 'getObject'})
                        .then((response) => axios(response.url).then((res) => res.data))
                        .catch((err) => ({error:err})
                ))
            )
        : []

    const optedIn = subs?.find(sub => sub.optInResearch === true)
    const email = survey.email || subs?.find(sub => sub.email)?.email
    let surveyResponse = {
        email,
        id: userId,
        opted_in: !!optedIn,
        opted_in_date: optedIn?.date,
        submission_ids: subs.map(sub => sub.storyId).join("|"),
        submission_fips: subs.map(sub => sub?.fips).join("|"),
        submission_counties: subs.map(sub => findCounty(sub?.fips)?.label).join("|"),
        gender: survey?.genderIdentity || 'NA',
        urbanicity: survey?.placeUrbanicity || 'NA',
        age: survey?.age || -1,
        additionalDescription: survey?.additionalDescription || 'NA',
        self_race: JSON.stringify(survey.selfIdentifiedRace),
        perc_race: JSON.stringify(survey.perceivedIdentifiedRace),
    } as SurveyRow

    if (survey){
        const perceivedRaceCategories =  ['self','perc']
        const raceQuestions = [
            survey.selfIdentifiedRace,
            survey.perceivedIdentifiedRace,
        ]
        raceQuestions.forEach((raceResponse: {name: string, description: string}[], i: number) => {
            if (raceResponse) {
                const prefix = perceivedRaceCategories[i]
                raceOptions.forEach(raceEth => {
                    const response = raceResponse.find(entry => entry.name === raceEth)
                    if (response) {
                        // @ts-ignore
                        surveyResponse[`${prefix} ${raceEth}`] = response ? 'true' : 'false'
                        // @ts-ignore
                        surveyResponse[`${prefix} ${raceEth} desc`] = response?.description || ''
                    }
                })
            }
        })
    }

    return surveyResponse    
}

const generateUrl = (surveyResponse: {[key: string]: any}) => {
    let baseUrl = process.env.DB_SURVEY_WRITE_URL! + '?'
    for (const key in surveyResponse) {
        baseUrl += `${encodeURIComponent(key)}=${encodeURIComponent(surveyResponse[key])}`
        baseUrl += '&'
    }
    return baseUrl.slice(0,-1)
}

async function main() {
	const entries = await axios(process.env.DB_SURVEY_READ_URL!)
		.then((res) => res.data)
		.then((csvString) => Papa.parse(csvString, { header: true }).data)
	const includedUsers = entries.map((row: SurveyRow) => row.id)
	const userList = await listUsers()
	const filteredUsers = userList.filter((user) => !includedUsers.includes(user))

    for (const user of filteredUsers) {
        const userInfo = await getUserInfo(user)
        const postUrl = generateUrl(userInfo)
        await axios(
            postUrl,
            {
                method: 'GET'
            }
        )
    }
}

main().then((r) => process.exit(0))
