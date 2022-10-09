import React, { useState, useEffect } from 'react'
import { Layer, Feature } from 'react-mapbox-gl'

const LinesMapLineLayer = ({ points, coordsA, coordsB, w = 1 }) => {
  if (points.length < 3) {
    return
  }
  return (
    <Layer
      type="line"
      paint={{
        'line-width': 1,
        'line-opacity': 0.15,
        // 'line-dasharray': [2, 2],
      }}
    >
      <Feature coordinates={[points[0], points[1]]} />
      <Feature coordinates={[points[1], points[2]]} />
    </Layer>
  )
}

export default LinesMapLineLayer
