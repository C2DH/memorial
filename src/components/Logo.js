import React from 'react';
import '../styles/components/Logo.css'

const Logo = ({
  width = 200,
  height = 200,
  marginTop = 35,
  marginLeft = 25,
  className,
  style
}) => {
  return (
    <div className={`Logo ${className}`} style={style}>
      <svg width={width} height={height} viewBox={`0 0 200 200`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x={marginLeft} y={marginTop}
          width="110" height="20"
        />
        <rect
          x={marginLeft+20} y={marginTop + 25}
          width="133" height="20"
        />
        <rect
          x={marginLeft} y={marginTop + 50}
          width="110" height="20"
        />
        <rect
          x={marginLeft} y={marginTop + 75}
          width="120" height="20"
        />
        <rect
          x={marginLeft + 50} y={marginTop + 100}
          width="60" height="20"
        />
      </svg>
    </div>
  )
}

export default Logo
