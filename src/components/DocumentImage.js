import React from 'react'
import '../styles/components/DocumentImage.css'

const DocumentImage = ({ doc = { data: {} } }) => {
  const mediumResolution = doc.data.resolutions?.medium?.url
  const thumbnailResolution = doc.data.resolutions?.thumbnail?.url
  const caption = doc.data.title || doc.title || doc.slug

  return (
    <div className="DocumentImage">
      <picture>
        <source media="(min-width:998px)" srcset={mediumResolution} />
        <img src={thumbnailResolution} alt={doc.type} />
      </picture>
      <figcaption className="small pb-3">
        <span className="badge bg-primary pb-1">{doc.data.type}</span>
        <br />
        <b>{caption}</b>
        <br />
        {doc.data.creator}
        <br />
        {doc.data.start_date} /{doc.data.end_date}
      </figcaption>
    </div>
  )
}

export default DocumentImage
