import React, { useRef, useEffect } from 'react'
import { Plus, Minus } from 'react-feather'
import { TransformWrapper, TransformComponent } from '@kokarn/react-zoom-pan-pinch'

const DocumentViewerImage = ({
  doc,
  fullScreen = false,
  caption = 'image',
  width,
  height = 100,
  isMobile,
}) => {
  const viewer = useRef()
  const availableWidth = fullScreen ? window.innerWidth : width
  const availableHeight = fullScreen ? window.innerHeight : height
  const imageOriginalWidth = doc.data.snapshot.width || availableWidth
  const imageOriginalHeight = doc.data.snapshot.height || availableHeight

  const url = doc.data.resolutions?.preview?.url

  // const frameHeight = height - 20
  const frameWidth = width - 20
  // use calculated height to prepare the zoom
  const perfectZoom = frameWidth / imageOriginalWidth
  // : (doc.data.snapshot.height || frameHeight) / frameHeight
  console.info(
    '[DocumentViewerImage]',
    '\n - fullScreen:',
    fullScreen,
    '\n - size:',
    doc.data.snapshot,
    '\n - size av.',
    { availableWidth, availableHeight },
  )

  useEffect(() => {
    if (viewer.current) {
      // centerview recalculated.
      const x = availableWidth / 2 - (imageOriginalWidth * perfectZoom) / 2
      const y = availableHeight / 2 - (imageOriginalHeight * perfectZoom) / 2
      viewer.current.setTransform(x, y, perfectZoom)
    }
  }, [
    perfectZoom,
    imageOriginalWidth,
    imageOriginalHeight,
    availableWidth,
    availableHeight,
    fullScreen,
  ])

  if (typeof url !== 'string') {
    return <div>mediaNotSupported</div>
  }
  return (
    <div style={{ height: availableHeight, width: availableWidth, borderWidth: '5px !important' }}>
      <TransformWrapper
        wheel={{ step: 0.1 }}
        ref={viewer}
        disabled={isMobile}
        minScale={0.1}
        width={availableWidth}
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

            <TransformComponent wrapperStyle={{ width: availableWidth, height: availableHeight }}>
              <img src={url} alt={caption} onLoad={(_) => centerView(perfectZoom)} />
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  )
}

export default DocumentViewerImage
