import React from 'react'
import { useTranslation } from 'react-i18next'
import DocumentReference from './DocumentReference'
import DocumentDate from './DocumentDate'
import '../styles/components/DocumentMetadata.css'

const DocumentMetadataField = ({ label, children }) => (
  <section className="mt-3">
    <label>{label}</label>
    <br />
    {children}
  </section>
)

const DocumentMetadata = ({ doc, memoid }) => {
  const { t, i18n } = useTranslation()
  const language = i18n.language.split('-').join('_')
  const availableLanguages = Object.keys(doc.data.title).filter(
    (d) => typeof doc.data.title[d] === 'string',
  )
  if (!availableLanguages.length) {
    console.error('[DocumentMetadata] No language available in doc.data.title', '\n - doc :', doc)
  }
  const availableLanguage =
    availableLanguages.length && typeof doc.data.title[language] !== 'string'
      ? availableLanguages[0]
      : language
  console.info('[DocumentMetadata]', memoid, doc.data.title, availableLanguage)

  const references = Array.isArray(doc.documents)
    ? doc.documents.filter((d) => d.type === 'bibtex')
    : null

  return (
    <div className="DocumentMetadata">
      <h2>{doc.data.title[availableLanguage] || doc.title || doc.slug}</h2>
      <DocumentDate doc={doc} language={language.split('_').join('-')}>
        {t('unkownDate')}
      </DocumentDate>
      {typeof doc.data.creator === 'string' && (
        <DocumentMetadataField label={t('creator')} children={doc.data.creator || t('nd')} />
      )}
      {typeof doc.data.author === 'string' && (
        <DocumentMetadataField label={t('author')}>{doc.data.author}</DocumentMetadataField>
      )}
      {typeof doc.data.photographer === 'string' && (
        <DocumentMetadataField label={t('photographer')}>
          {doc.data.photographer}
        </DocumentMetadataField>
      )}
      {typeof doc.data.copyright === 'string' && (
        <DocumentMetadataField label={t('copyright')} children={doc.data.copyright} />
      )}
      <section className="mt-3">
        <label>{t('citeAs')}</label>
        {references !== null &&
          references.map((d) => <DocumentReference className="" key={d.id} doc={d} />)}
      </section>
    </div>
  )
}

export default DocumentMetadata
// export default React.memo(
//   DocumentMetadata,
//   (prevProps, nextProps) => prevProps.memoid === nextProps.memoid,
// )
