import React from 'react'
import '../styles/components/CoverItems.css'
const CoverItems = ({ covers = [], size = 50, ...rest }) => {
  return (
    <ol className="CoverItems" {...rest}>
      {covers.map((doc, i) => {
        const thumbnailResolution = doc.data.resolutions?.thumbnail?.url
        return (
          <picture key={doc.id}>
            <img src={thumbnailResolution} alt={doc.type} style={{ width: size }} />
          </picture>
        )
      })}
    </ol>
  )
}

export default CoverItems