import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CountyList from './CountyList.json'

interface ComboBoxProps {
    onChange: (event: React.SyntheticEvent, newValue: any) => void;
    value: string;
}

export const CountySelect: React.FC<ComboBoxProps> = ({onChange, value}) => {
    
  return (
    <Autocomplete
      disablePortal
      onChange={onChange}
      id="combo-box-demo"
      options={CountyList}
      fullWidth
      renderInput={(params) => <TextField {...params} label="What US county and state are you in? (type to search)" />}
    />
  );
}