import { useRef, useEffect } from 'react'
import { useScrollStore } from '../store'

export const ScrollController = ({ children }) => {
  const scrollContainer = useRef(null)

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.current
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100
    useScrollStore.getState().setScroll(scrollPercentage)
  }

  useEffect(() => {
    const container = scrollContainer.current
    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      ref={scrollContainer}
      className="scroll-controller"
      style={{ position: 'absolute', inset: 0, overflow: 'scroll', width: '100%', height: '100%' }}
    >
      <div style={{ height: `${8 * 100}vh`, width: '100%' }}>{children}</div>
    </div>
  )
}
