import React from 'react'
import DocumentReference from './DocumentReference'
import DocumentDate from './DocumentDate'
import '../styles/components/DocumentImage.css'
import { useTranslation } from 'react-i18next'
import { useAvailableLanguage } from '../hooks/language'

const DocumentImage = ({ doc = { data: {} }, language = 'en', onClick, className = '' }) => {
  const { t } = useTranslation()
  const mediumResolution = doc.data.resolutions?.medium?.url
  const thumbnailResolution = doc.data.resolutions?.thumbnail?.url

  const { availableLanguage } = useAvailableLanguage({
    translatable: doc.data.title,
  })
  const caption =
    typeof doc.data.title === 'object'
      ? doc.data.title[availableLanguage]
      : doc.data.title || doc.title || doc.slug
  const references = Array.isArray(doc.documents)
    ? doc.documents.filter((d) => d.type === 'bibtex')
    : null
  console.info('DocumentImage', doc, '\n - ref:', references)

  return (
    <div className={`DocumentImage ${className}`}>
      <picture onClick={onClick}>
        <source media="(min-width:998px)" srcSet={mediumResolution} />
        <img src={thumbnailResolution} alt={doc.type} />
      </picture>
      <figcaption className="small pb-3">
        <span className="badge bg-primary pb-1">{doc.data.type}</span>

        {references !== null ? (
          references.map((ref) => <DocumentReference className="" key={ref.id} doc={ref} />)
        ) : (
          <p>
            <em>{caption}</em>
            <br />
            {doc.data.creator}
            <br />
          </p>
        )}
        <DocumentDate doc={doc} references={references} language={language}>
          {t('unkownDate')}
        </DocumentDate>
      </figcaption>
    </div>
  )
}

export default DocumentImage
