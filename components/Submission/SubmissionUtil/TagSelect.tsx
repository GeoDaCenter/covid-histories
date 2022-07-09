import React, { useState } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@mui/material'

const allTags = [
  'family',
  'community',
  'work',
  'equity',
  'education',
  'children'
]

interface TagSelectProps {
  tags: string[]
  onChange: (tag: any) => void
}

export const TagSelect: React.FC<TagSelectProps> = ({ tags, onChange }) => {
  const [customTag, setCustomTag] = useState('')
  const handleCustomTagText = (e: any) => {
    setCustomTag(e?.target?.value || '')
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }
  const addTag = (tag: string) => {
    if (!tags || !tags.length) {
      onChange([tag])
    } else {
      onChange([...tags, tag])
    }
  }
  const handleTextField = (e: any) => {
    if (e.keyCode == 13) {
      addTag(e.target.value)
      setCustomTag('')
    }
  }

  return (
    <Grid
      container
      spacing={1}
      sx={{ mb: 2, p: 1, background: 'rgb(30,30,30)', borderRadius: '.375em' }}
    >
      <Grid item xs={12} md={6} sx={{ borderRight: '1px solid black' }}>
        <Typography>Add tags to describe your story</Typography>
        {allTags
          .filter((tag) => !tags?.includes(tag))
          .map((Tag, i) => (
            <Button
              key={i}
              onClick={() => addTag(Tag)}
              sx={{ textTransform: 'none' }}
              color="primary"
            >
              #{Tag} +
            </Button>
          ))}
        <br />
        <FormControl sx={{ mt: 2 }}>
          <TextField
            id="custom-tag"
            aria-describedby="custom-tag-helper-text"
            variant="outlined"
            label="Add your own tag"
            value={customTag}
            onChange={handleCustomTagText}
            onKeyDown={handleTextField}
          />
          <FormHelperText id="custom-tag-helper-text">
            Press enter to add your tag.
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography>Remove Tag</Typography>
        {tags.map((Tag, i) => (
          <Button key={i} onClick={() => removeTag(Tag)}>
            #{Tag} &times;
          </Button>
        ))}
      </Grid>
    </Grid>
  )
}
