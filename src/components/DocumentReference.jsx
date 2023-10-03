import { useTranslation } from 'react-i18next'
import Cite from 'citation-js'
import '../styles/components/DocumentReference.css'

/**
 * DocumentReference is a React component that displays a formatted reference for a document.
 *
 * @param {Object} doc - an object representing the document. It should contain a field `data.csljson` with the document data in CSL-JSON format.
 * @param {string} className - an optional CSS class that can be applied to the component's container element.
 */
const DocumentReference = ({ doc = {}, className = 'small' }) => {
  const { i18n } = useTranslation()

  // if the `data.csljson` field is not present in the doc object, log an error and return null
  if (!doc.data?.csljson) {
    console.error('data.csljson field not found in doc:', doc)
    return null
  }
  const cite = new Cite(doc.data.csljson)

  // format the reference using the `Cite` instance and the specified citation style (APA style in this case)
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
