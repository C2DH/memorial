import React from 'react'
import { useTranslation } from 'react-i18next'
import Cite from 'citation-js'
import '../styles/components/DocumentReference.css'

const DocumentReference = ({ doc = {}, className = 'small' }) => {
  const { i18n } = useTranslation()
  if (!doc.data?.csljson) {
    console.error('data.csljson field not found in doc:', doc)
    return null
  }
  const cite = new Cite(doc.data.csljson)
  let reference = cite.format('bibliography', {
    template: 'apa',
    format: 'html',
    lang: i18n.language,
  })
  if (typeof reference === 'string') {
    reference = reference.replace(
      /(https?:\/\/[0-9a-zA-Z-./_:?=%&#;]+)/g,
      (m, link) => `<a href="${link}" target="_blank">${link}</a>`,
    )
  }
  return (
    <div className={`DocumentReference ${className}`}>
      {reference !== null && <p dangerouslySetInnerHTML={{ __html: reference }} />}
    </div>
  )
}

export default DocumentReference
