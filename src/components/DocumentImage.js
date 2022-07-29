import React from 'react'
import DocumentReference from './DocumentReference'
import '../styles/components/DocumentImage.css'

const DocumentImage = ({ doc = { data: {} }, onclick }) => {
  const mediumResolution = doc.data.resolutions?.medium?.url
  const thumbnailResolution = doc.data.resolutions?.thumbnail?.url
  const caption = doc.data.title || doc.title || doc.slug
  const references = Array.isArray(doc.documents)
    ? doc.documents.filter((d) => d.type === 'bibtex')
    : null
  console.info('DocumentImage', doc, '\n - ref:', references)

  return (
    <div className="DocumentImage">
      <picture onClick={onclick}>
        <source media="(min-width:998px)" srcSet={mediumResolution} />
        <img src={thumbnailResolution} alt={doc.type} />
      </picture>
      <figcaption className="small pb-3">
        <span className="badge bg-primary pb-1">{doc.data.type}</span>

        <br />
        {references !== null ? (
          references.map((ref) => <DocumentReference className="" key={ref.id} doc={ref} />)
        ) : (
          <>
            <i>{caption}</i> <br />
            {doc.data.creator}
          </>
        )}
        <br />
        {doc.data.start_date ? (
          <>
            {doc.data.start_date} /{doc.data.end_date}
          </>
        ) : null}
      </figcaption>
    </div>
  )
}

export default DocumentImage
