import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CountyList from './CountyList.json'
import colors from '../../../config/colors'

interface ComboBoxProps {
	onChange: (event: React.SyntheticEvent, newValue: any) => void
	value: {
		label: string
		value: number
	}
}

export const CountySelect: React.FC<ComboBoxProps> = ({ onChange, value }) => {
	return (
		<>
		<Autocomplete
			disablePortal
			onChange={onChange}
			id="combo-box-county"
			options={CountyList}
			fullWidth
			value={value}
			sx={{
				color:'red',
				borderLeft: `4px solid ${colors.yellow}`,
			}}
			renderInput={(params) => (
				<TextField
					{...params}
					label="What US county and state are you in? (type to search)"
				/>
			)}
		/>
		<label id="combo-box-county-label" style={{color: colors.yellow}}>* required</label>
		</>
	)
}
