import React from 'react'
import '../styles/components/Logo.css'

const Logo = ({
  width = 200,
  height = 200,
  marginTop = 35,
  marginLeft = 25,
  color = 'var(--bs-dark)',
  className,
  style,
  onClick,
  isMobile = true,
}) => {
  return (
    <div className={`Logo ${className}`} style={style} onClick={onClick}>
      {isMobile ? (
        <p className="Logo_mobiletext">
          <span style={{ paddingLeft: 12 }}>Luxembourg</span> <br />
          <span className="ms-2" style={{ paddingLeft: 25 }}>
            Mémorial
          </span>
          &nbsp;
          <span>de la Shoah</span>
        </p>
      ) : (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 200 200`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x={marginLeft} y={marginTop} width="110" height={20} fill={color} />
          <text x={marginLeft + 5} y={marginTop + 15} fill={style.color || 'white'}>
            Luxembourg
          </text>
          <rect x={marginLeft + 30} y={marginTop + 25} width="123" height={20} fill={color} />
          <text
            x={marginLeft + 75}
            y={marginTop + 40}
            fill={style.color || 'white'}
            className="fw-bold"
          >
            Mémorial
          </text>
          <rect x={marginLeft} y={marginTop + 50} width="110" height={20} fill={color} />
          <text x={marginLeft + 70} y={marginTop + 65} fill={style.color || 'white'}>
            de
          </text>
          <rect x={marginLeft} y={marginTop + 75} width="120" height={20} fill={color} />
          <text x={marginLeft + 75} y={marginTop + 90} fill={style.color || 'white'}>
            la
          </text>
          <rect x={marginLeft + 50} y={marginTop + 100} width="60" height={20} fill={color} />
          <text x={marginLeft + 56} y={marginTop + 115} fill={style.color || 'white'}>
            Shoah
          </text>
        </svg>
      )}
    </div>
  )
}

export default Logo
