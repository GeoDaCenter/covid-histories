import CountyList from '../components/Submission/SubmissionUtil/CountyList.json'

export const findCounty = (
	fips: number
): {
	label: string
	value: number
	centroid: number[]
} => {
	return (
		CountyList.find((f) => f.value === fips) || {
			label: '',
			value: -1,
			centroid: [0, 0]
		}
	)
}
