import React, { useEffect, useRef } from 'react'
import { useSpring, a, config } from 'react-spring'
import backgroundImage from '../assets/images/landscape.png' // Import using relative path

const calc =
  (speed = -0.5) =>
  (o) =>
    `translateY(${o * speed}px)`

const HomeLandscape = ({ width, height, initialOffset = 100 }) => {
  const ref = useRef()
  const [{ offset }, set] = useSpring(() => ({ offset: 0, config: config.stiff }))

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

  return (
    <div
      ref={ref}
      className="position-absolute top-0"
      style={{ width, height, zIndex: -1, overflow: 'hidden' }}
    >
      <a.div
        className="position-absolute top-0 w-100"
        style={{
          zIndex: -1,
          backgroundSize: 'cover',
          backgroundImage: `url(${backgroundImage})`,
          height: '159%',
          transform: offset.interpolate(calc(-0.5)),
        }}
      />
      <div
        className="position-absolute top-0 w-100 h-100"
        style={{
          background: 'linear-gradient(to bottom, #ffefe500 50%, #ffefe5)',
        }}
      />
    </div>
  )
}

export default HomeLandscape
