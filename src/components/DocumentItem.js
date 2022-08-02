import React from 'react'
import { useNavigate } from 'react-router-dom'
import DocumentReference from './DocumentReference'
import DocumentImage from './DocumentImage'

const AvailableDocumentListItemComponents = {
  reference: DocumentReference,
  image: DocumentImage,
  doc: DocumentImage,
}

const DocumentItem = ({ doc = { data: {} }, onClick }) => {
  const navigate = useNavigate()
  const Component = AvailableDocumentListItemComponents[doc.data.type]

  if (typeof Component !== 'undefined') {
    return <Component doc={doc} onClick={() => navigate(`/doc/${doc.slug}`)} />
  } else {
    return (
      <div>
        Not found!<pre>{JSON.stringify(doc.data, null, 1)}</pre>
      </div>
    )
  }
}

export default DocumentItem
