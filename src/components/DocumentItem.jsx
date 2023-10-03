import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DocumentReference from './DocumentReference'
import DocumentImage from './DocumentImage'
import DocumentDoc from './DocumentDoc'
import Person from './Person'

const AvailableDocumentListItemComponents = {
  reference: DocumentReference,
  image: DocumentImage,
  doc: DocumentImage,
  person: Person,
  document: DocumentDoc,
}

const DocumentItem = ({ doc = { data: {} }, onClick, ...rest }) => {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const language = i18n.language.split('-').shift()
  const Component = AvailableDocumentListItemComponents[doc.data.type]

  if (typeof Component !== 'undefined') {
    return (
      <Component
        doc={doc}
        onClick={() =>
          typeof onClick === 'function' ? onClick(doc) : navigate(`/${language}/doc/${doc.slug}`)
        }
        language={language}
        {...rest}
      />
    )
  } else {
    return (
      <div>
        Not found! {doc.slug}
        <pre>{JSON.stringify(doc.data, null, 1)}</pre>
      </div>
    )
  }
}

export default DocumentItem
