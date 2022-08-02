import React, { useRef } from 'react'
import { Plus, Minus } from 'react-feather'
import { TransformWrapper, TransformComponent } from '@kokarn/react-zoom-pan-pinch'

const DocumentViewerImage = ({ doc, caption = 'image', width, height, isMobile }) => {
  const viewer = useRef()
  const url = doc.data.resolutions?.preview?.url

  if (typeof url !== 'string') {
    return <div>mediaNotSupported</div>
  }
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
              <img src={url} alt={caption} onLoad={(_) => centerView(1)} />
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  )
}

export default DocumentViewerImage
