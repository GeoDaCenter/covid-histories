import React, { useEffect, useState } from 'react'

import Link from 'next/link';
import styled from 'styled-components'
import { db, resetDatabase } from '../../stores/indexdb/db'
// UI
import { Alert, Box, Button, Snackbar } from '@mui/material'


const StyledLink = styled.a `
    color: #F37E44;
`

export const SubmissionDisabledNotice: React.FC = () => {
    return (
        <Box
            sx={{ margin: '1.5em auto', padding:'1em', fontStyle:'italic', textAlign:'center', background:'none', color:'#c1ebeb', borderRadius:'5px', border:'1px solid #c1ebeb' }}
            className="standard-page-width"
        >Story submission has been closed. Visit the <Link href="https://uscovidatlas.org/archive" passHref>
            <StyledLink>stories archive</StyledLink></Link> to see past submissions. Thank you to all our contributors!
        </Box>
    )
}