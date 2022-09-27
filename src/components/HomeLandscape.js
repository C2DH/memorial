import React, { useEffect } from 'react'
import { useSpring, a, config } from 'react-spring'
import Vimeo from '@u-wave/react-vimeo'

const calc =
  (speed = -0.5) =>
  (o) =>
    `translateY(${o * speed}px)`

const HomeLandscape = ({
  videoId = '752522885',
  videoHeight = 360,
  videoWidth = 640,
  initialOffset = 0,
  availableWidth = 100,
  availableHeight = 100,
}) => {
  const [{ offset, opacity }, set] = useSpring(() => ({
    offset: 0,
    opacity: 0,
    config: config.stiff,
  }))
  const scale = Math.max(availableWidth / videoWidth, availableHeight / videoHeight) * 1.2
  const scaledWidth = videoWidth * scale
  const scaledHeight = videoHeight * scale

  useEffect(() => {
    const handleScroll = () => {
      // const posY = ref.current.getBoundingClientRect().top;
      const offset = window.pageYOffset - initialOffset
      set({ offset })
    }
    window.addEventListener('scroll', handleScroll)
    set({ offset: -initialOffset })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [set, initialOffset])

  console.debug(
    '[HomeLandscape] \n- availableWidth:',
    availableWidth,
    '\n- availableHeight:',
    availableHeight,
    '\n- scale:',
    scale,
  )
  return (
    <div
      className="position-absolute top-0"
      style={{
        width: availableWidth,
        height: availableHeight,
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      <a.div
        className="position-absolute top-0 w-100 h-100"
        style={{
          zIndex: -1,
          transform: offset.to(calc(1.5)),
          background:
            'linear-gradient(to bottom, var(--bs-secondary), rgb(89,196,171), rgb(60,139,161))',
        }}
      >
        <a.div style={{ opacity }} className="position-absolute top-0 w-100 h-100">
          <Vimeo
            video={videoId}
            autoplay
            width={scaledWidth}
            height={scaledHeight}
            className="position-absolute "
            style={{
              top: -(scaledHeight / 2 - availableHeight / 2),
              zIndex: 0,
              left: -(scaledWidth / 2 - availableWidth / 2),
            }}
            loop
            muted
            background
            onPlay={() => {
              console.debug('[HomeLandscape] @onPlay')
              set({ opacity: 1 })
            }}
          />
        </a.div>
      </a.div>
    </div>
  )
}

export default HomeLandscape
