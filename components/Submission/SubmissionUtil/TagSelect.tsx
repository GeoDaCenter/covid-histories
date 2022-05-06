import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const allTags = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

interface TagSelectProps {
    tags: string[]
    onChange: (tag: any) => void
}

export const TagSelect: React.FC<TagSelectProps> = ({
    tags,
    onChange
}) => {

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-multiple-name-label">Would you like to tag your story?</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={tags||['']}
          onChange={(e) => onChange(e?.target?.value)}
        >
          {allTags.map((tag) => (
            <MenuItem
              key={tag}
              value={tag}
              style={{
                fontWeight: tags?.includes(tag) ? 'bold' : 'normal',
              }}
            >
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}