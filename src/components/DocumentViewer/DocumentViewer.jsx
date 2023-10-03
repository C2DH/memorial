import { useRef, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { Maximize } from 'react-feather'
import { useFullScreen } from '../../hooks/viewport'
import '../../styles/components/DocumentViewer.css'

const DocumentViewerImage = lazy(() => import('./DocumentViewerImage'))
const DocumentViewerAudio = lazy(() => import('./DocumentViewerAudio'))
// const DocumentViewerPdf = lazy(() => import('./DocumentViewerPdf'))

const DocumentViewer = ({ doc, caption, width, height }) => {
  const { t } = useTranslation()
  const ref = useRef()
  const { fullScreen, toggle: toggleFullScreen } = useFullScreen(ref)

  let Component = ({ doc }) => <pre>Unknown type: {doc.type}</pre>
  const props = {
    doc,
    caption,
    width,
    height,
    fullScreen,
  }
  // @todo has IIIF ? let's try the iframe :)
  if (doc.type === 'image') {
    Component = <DocumentViewerImage {...props} />
  } else if (doc.type === 'audio') {
    Component = <DocumentViewerAudio {...props} />
  } else if (doc.type === 'pdf') {
    Component = <DocumentViewerImage {...props} />
  }
  return (
    <div ref={ref} className="DocumentViewer rounded position-relative" style={{ width, height }}>
      <div className="position-absolute bottom-0 end-0 p-2" style={{ zIndex: 100 }}>
        <button
          className="btn DocumentViewer_btn DocumentViewer_toggleFullScreen"
          onClick={toggleFullScreen}
        >
          <Maximize size={16} />
          {fullScreen}
        </button>
      </div>
      {Component}
      <div className="text-end ">
        <button className="btn btn-link btn-sm" onClick={toggleFullScreen}>
          {t('viewFullScreen')}
        </button>
      </div>
    </div>
  )
}

export default DocumentViewer
