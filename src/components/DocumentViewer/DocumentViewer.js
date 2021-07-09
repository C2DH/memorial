import React from 'react'

const DocumentViewer = ({ doc }) => {
  const pictureUrl = doc.data.resolutions?.thumbnail?.url
  return (
    <>
    <img src={pictureUrl} alt='thumbnail'/>
    <h2>{doc.title}</h2>
    </>
  )
}

export default DocumentViewer
