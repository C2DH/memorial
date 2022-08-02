import React, { lazy } from 'react'
import '../../styles/components/DocumentViewer.css'

const DocumentViewerImage = lazy(() => import('./DocumentViewerImage'))
const DocumentViewerAudio = lazy(() => import('./DocumentViewerAudio'))
const DocumentViewerPdf = lazy(() => import('./DocumentViewerPdf'))

const DocumentViewer = ({ doc, caption, width, height }) => {
  let Component = ({ doc }) => <pre>Unknown type: {doc.type}</pre>
  const props = {
    doc,
    caption,
    width,
    height,
  }
  // @todo has IIIF ? let's try the iframe :)
  if (doc.type === 'image') {
    Component = <DocumentViewerImage {...props} />
  } else if (doc.type === 'audio') {
    Component = <DocumentViewerAudio {...props} />
  } else if (doc.type === 'pdf') {
    Component = <DocumentViewerPdf {...props} />
  }
  return Component
}

export default DocumentViewer
