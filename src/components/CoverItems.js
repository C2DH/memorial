import React from 'react'
import '../styles/components/CoverItems.css'

const CoverItems = ({ covers = [], size = 120, style, ...rest }) => {
  const pictureStyle = (i) => ({
    transform: `translate3d(-10px, -50%, 0) rotate(-${i * 3 + Math.random() * 5}deg)`,
  })
  return (
    <ol className="CoverItems" style={{ minWidth: size, ...style }} {...rest}>
      {covers.map((doc, i) => {
        const thumbnailResolution = doc.data.resolutions?.thumbnail?.url
        return (
          <picture key={doc.id} style={pictureStyle(i)}>
            <img src={thumbnailResolution} alt={doc.type} style={{ width: size }} />
          </picture>
        )
      })}
    </ol>
  )
}

export default CoverItems
