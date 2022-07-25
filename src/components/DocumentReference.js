import React from 'react'
import Cite from 'citation-js'

const DocumentReference = ({ doc = {} }) => {
  if (!doc.data?.csljson) {
    console.error('data.csljson field not found in doc:', doc)
    return null
  }
  const cite = new Cite(doc.data.csljson)
  const reference = cite.format('bibliography', {
    template: 'apa',
    format: 'html',
  })

  return (
    <div class="small">
      {reference !== null && <p dangerouslySetInnerHTML={{ __html: reference }} />}
    </div>
  )
}

export default DocumentReference
