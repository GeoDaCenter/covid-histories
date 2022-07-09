import React from 'react'
import CountyList from './CountyList.json'
import { Marker, StaticMap } from 'react-map-gl'
import { Box } from '@mui/material'

const CountyPreview: React.FC<{ county: any }> = ({ county }) => {
  if (typeof window === 'undefined') return null

  const position = CountyList.find(({ value }) => value === county.value)
    ?.centroid || [0, 0]

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: '100%',
        height: 400,
        overflow: 'hidden'
      }}
    >
      <StaticMap
        width={'100%'}
        height={'100%'}
        latitude={position[1]}
        longitude={position[0]}
        zoom={6}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <Marker latitude={position[1]} longitude={position[0]}>
          <Box
            sx={{
              background: 'black',
              border: '1px solid white',
              width: '20px',
              height: '20px',
              borderRadius: '10px'
            }}
          />
        </Marker>
      </StaticMap>
    </Box>
  )
}

export default CountyPreview
