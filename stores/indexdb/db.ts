import { nanoid } from '@reduxjs/toolkit'
import Dexie, { Table } from 'dexie'
import { SubmissionTypes } from '../submission/submissionSlice'
import { SubmissionDraft } from './SubmissionDraft'

export class SubmissionDB extends Dexie {
	submissions!: Table<SubmissionDraft, number>
	constructor() {
		super('SubmissionDrafts')
		this.version(1).stores({
			submissions: '++id'
		})
	}

	deleteSubmission(submissionId: string) {
		return this.transaction('rw', this.submissions, () => {
			this.submissions.where({ submissionId }).delete()
		})
	}
}

export const db = new SubmissionDB()

interface ResetDbProps {
	storyId?: string
	storyType?: SubmissionTypes 
}
export function resetDatabase({
	storyId='',
	storyType='video'
}: ResetDbProps ) {
	return db.transaction('rw', db.submissions, async () => {
		await Promise.all(db.tables.map((table) => table.clear())).then(() => {
			db.submissions.add({
				id: 0,
				storyId: storyId || nanoid(),
				type: storyType,
				content: '',
				additionalContent: '',
				completed: false
			})
		})
	})
}
