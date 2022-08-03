import React, { useRef } from 'react'
import { Plus, Minus } from 'react-feather'
import { TransformWrapper, TransformComponent } from '@kokarn/react-zoom-pan-pinch'

const DocumentViewerImage = ({ doc, caption = 'image', width, height = 100, isMobile }) => {
  const viewer = useRef()
  const url = doc.data.resolutions?.preview?.url

  if (typeof url !== 'string') {
    return <div>mediaNotSupported</div>
  }
  // const frameHeight = height - 20
  const frameWidth = width - 20
  // use calculated height to prepare the zoom
  const perfectZoom = frameWidth / (doc.data.snapshot.width || frameWidth)
  // : (doc.data.snapshot.height || frameHeight) / frameHeight
  console.info(
    '[DocumentViewerImage]',
    doc.data.snapshot,
    // frameHeight,
    frameWidth,
    perfectZoom,
    doc.data.snapshot.height > doc.data.snapshot.width,
  )
  return (
    <div style={{ height, width, borderWidth: '5px !important' }}>
      <TransformWrapper
        wheel={{ step: 0.1 }}
        ref={viewer}
        disabled={isMobile}
        minScale={0.1}
        width={width}
        center
      >
        {({ zoomIn, zoomOut, centerView }) => (
          <React.Fragment>
            {!isMobile && (
              <div className="DocumentViewerImage_tools position-absolute">
                <button className="zoomIn" onClick={() => zoomIn()}>
                  <Plus size={18} />
                </button>
                <button className="zoomOut" onClick={() => zoomOut()}>
                  <Minus size={18} />
                </button>
              </div>
            )}

            <TransformComponent wrapperStyle={{ width, height }}>
              <img src={url} alt={caption} onLoad={(_) => centerView(perfectZoom)} />
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  )
}

export default DocumentViewerImage
