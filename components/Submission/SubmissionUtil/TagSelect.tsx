import React, {useState} from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';

const allTags = [
  'family',
  'community',
  'work',
  'equity',
  'education',
  'children'
];

interface TagSelectProps {
    tags: string[]
    onChange: (tag: any) => void
}

export const TagSelect: React.FC<TagSelectProps> = ({
    tags,
    onChange
}) => {
  const [customTag, setCustomTag] = useState('')
  const handleCustomTagText = (e: any) => {
    setCustomTag(e?.target?.value || '')
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag))
  }
  const addTag = (tag: string) => {
    if (!tags || !tags.length){
      onChange([tag])
    } else {
      onChange([...tags, tag])
    }
  }

  return (
    <Grid container spacing={1} sx={{mb:2}}>
      <Grid item xs={12} md={6}>
        <Typography>
          Click to add additional tags
        </Typography>
        {allTags.filter(tag => !(tags?.includes(tag))).map((Tag, i) => <Button key={i} onClick={() => addTag(Tag)} sx={{color:'chartreuse', textTransform:'none'}}>#{Tag} +</Button>)}
        <TextField variant="outlined" label="Add your own tag" value={customTag} onChange={handleCustomTagText} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography>
          Remove Tag
        </Typography>
        {tags.map((Tag, i) => <Button key={i} onClick={() => removeTag(Tag)}>#{Tag} &times;</Button>)}
      </Grid>
    </Grid>
  );
}