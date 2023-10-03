import DocumentReference from './DocumentReference'
import DocumentDate from './DocumentDate'
import { useTranslation } from 'react-i18next'

const DocumentDoc = ({ doc = { data: {} }, language = 'en' }) => {
  const { t } = useTranslation()
  const caption = doc.data.title || doc.title || doc.slug
  const references = Array.isArray(doc.documents)
    ? doc.documents.filter((d) => d.type === 'bibtex')
    : null

  return (
    <div className="DocumentDoc">
      <figcaption className="small pb-3">
        <span className="badge bg-primary pb-1">{doc.data.type}</span>
        {references !== null ? (
          references.map((ref) => <DocumentReference className="" key={ref.id} doc={ref} />)
        ) : (
          <>
            <br />
            <i>{caption}</i>
            {doc.data.creator}
            <br />
          </>
        )}
        <DocumentDate doc={doc} references={references} language={language}>
          {t('unkownDate')}
        </DocumentDate>
      </figcaption>
    </div>
  )
}

export default DocumentDoc
