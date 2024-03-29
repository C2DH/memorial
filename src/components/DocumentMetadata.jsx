import React from 'react'
import { useTranslation } from 'react-i18next'
import DocumentReference from './DocumentReference'
import DocumentDate from './DocumentDate'
import AvailableLanguages from './AvailableLanguages'
import { useAvailableLanguage } from '../hooks/language'
import '../styles/components/DocumentMetadata.css'

const DocumentMetadataField = ({ label, children }) => {
  if (typeof children === 'string' && children.length === 0) {
    return null
  }
  return (
    <section className="mt-3">
      <label>{label}</label>
      <br />
      {children}
    </section>
  )
}

const DocumentMetadata = ({ doc, memoid }) => {
  const { t } = useTranslation()
  const { requestedLanguage, availableLanguage, availableLanguages } = useAvailableLanguage({
    translatable: doc.data.title,
  })
  let title = availableLanguage !== null ? doc.data.title[availableLanguage] : doc.title

  // if (availableLanguage === null) {
  //
  // }
  //     ? typeof doc.data.title === 'string'
  //       ? doc.data.title
  //       : null
  //     : doc.data.title[availableLanguage]

  // extract title from the reference if any
  console.info(
    '[DocumentMetadata]',
    '\n - title (metadata):',
    title,
    '\n - availableLanguages:',
    availableLanguages,
  )

  const references = Array.isArray(doc.documents)
    ? doc.documents.filter((d) => ['zotero-item', 'bibtex'].includes(d.type))
    : null

  if (references !== null && title == null) {
    title = references.map((d) => d.title).pop()
  }

  return (
    <div className="DocumentMetadata">
      <h2>{title}</h2>
      <AvailableLanguages
        languages={availableLanguages}
        className="DocumentMetadata_languages mb-3"
        labelIfEmpty="documentWithoutTranslations"
        labelifTranslated="documentTranslatedIn"
      />
      <DocumentDate
        doc={doc}
        references={references}
        language={requestedLanguage.split('_').join('-')}
      >
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
        {references !== null &&
          references.map((d) => (
            <React.Fragment key={d.id}>
              <label>{t('citeAs')}</label>
              <DocumentReference className="" key={d.id} doc={d} />

              <DocumentMetadataField label={t('archive')}>{d.data.archive}</DocumentMetadataField>
              <DocumentMetadataField label={t('archiveLocation')}>
                {d.data.archiveLocation}
              </DocumentMetadataField>
              <DocumentMetadataField label={t('moreInfo')}>
                {d.data?.csljson?.abstract}
              </DocumentMetadataField>
            </React.Fragment>
          ))}
      </section>
    </div>
  )
}

export default DocumentMetadata
// export default React.memo(
//   DocumentMetadata,
//   (prevProps, nextProps) => prevProps.memoid === nextProps.memoid,
// )
