import React, { useRef, useEffect, useState } from 'react'

const ResizeableCanvas = ({ Renderer, height=100, width=100, canvasHeight, canvasWidth, ...props }) => {
  const canvasRef = useRef(null)
  const [{ ctx, ratio }, setCanvasProps] = useState({
    ratio: 2,
    ctx: null
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { devicePixelRatio:ratio=1 } = window
    console.info('resizeCanvas', width, height, ratio)
    canvas.width = canvasWidth ?? width*ratio
    canvas.height = canvasHeight ?? width*ratio
    setCanvasProps({ ratio, ctx })
    ctx.scale(ratio, ratio)
  }, [width, height, canvasWidth, canvasHeight])

  if (!Renderer) {
    return null
  }
  return (
    <>
      <canvas style={{position: 'absolute' }} ref={canvasRef}/>
      <Renderer ctx={ctx} height={height} width={width} ratio={ratio} />
    </>
  )
}


export default ResizeableCanvas
