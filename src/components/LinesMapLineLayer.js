import React, { useState, useEffect } from 'react'
import { Layer, Feature } from 'react-mapbox-gl'

const LinesMapLineLayer = ({ coordsA, coordsB, w }) => {
  return (
    <Layer
      type="line"
      paint={{
        'line-width': w * 5,
        'line-opacity': 0.8,
        'line-dasharray': [2, 2],
      }}
    >
      <Feature coordinates={[coordsA, coordsB]} />
    </Layer>
  )
}

export default LinesMapLineLayer
