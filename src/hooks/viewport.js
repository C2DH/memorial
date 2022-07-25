import { useEffect, useRef, useState } from 'react'

const getWidth = () =>
  window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth

const getHeight = () =>
  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

const getWindowDimensions = () => ({
  width: getWidth(),
  height: getHeight(),
})

/*
  Based on
  https://dev.to/vitaliemaldur/resize-event-listener-using-react-hooks-1k0c
  consulted on 2021-02-26
*/
export const useCurrentWindowDimensions = () => {
  let [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())
  useEffect(() => {
    let timeoutId = null
    const resizeListener = () => {
      clearTimeout(timeoutId)
      const dims = getWindowDimensions()
      timeoutId = setTimeout(() => setWindowDimensions(dims), 150)
      // console.info('setWindowDimensions', dims)
    }
    window.addEventListener('resize', resizeListener)

    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [])
  return windowDimensions
}

/**
 * Calculate available rectangle for the given ref.
 * usage inside functional components:
 *
 *     const [bbox, ref] = useBoundingClientRect()
 *     return (<div ref="ref"></div>)
 */
export const useBoundingClientRect = ({ isMobile = false } = {}) => {
  const ref = useRef()
  const [bbox, setBbox] = useState({
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    x: 0,
    y: 0,
    memo: '0x0',
    isReady: false,
    windowDimensions: getWindowDimensions(),
    orientation: null,
  })
  const setCurrentBoundingClientRect = () => {
    const w = getWindowDimensions()
    const rect = ref && ref.current ? ref.current.getBoundingClientRect() : { width: 0, height: 0 }
    const memo = `${rect.width}x${rect.height},${w.width}x${w.height}`
    const orientation = w.width < w.height ? 'portrait' : 'landscape'
    if (isMobile && bbox.height > 0) {
      if (orientation === bbox.orientation) {
        console.debug('useBoundingClientRect (isMobile) same orientation.')
        return
      }
    }
    if (memo !== '0x0' && memo !== bbox.memo) {
      console.info('setCurrentBoundingClientRect', memo, bbox.memo)

      // extract one dimension by one dimension, the only way
      // as the result of el.getBoundingClientRect() returns a special object
      // of type ClientRect (or DomRect apparently)
      const { top, right, bottom, left, width, height, x, y } = rect
      setBbox({
        top,
        right,
        bottom,
        left,
        width,
        height,
        x,
        y,
        memo,
        isReady: true,
        windowDimensions: w,
        orientation,
      })
    }
  }
  if (isMobile) {
    console.debug('useBoundingClientRect', bbox.windowDimensions)
  }
  useEffect(() => {
    let timeoutId = null
    const resizeListener = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setCurrentBoundingClientRect()
      }, 100)
    }
    setCurrentBoundingClientRect()
    window.addEventListener('resize', resizeListener)
    return () => {
      window.removeEventListener('resize', resizeListener)
      clearTimeout(timeoutId)
    }
  })
  return [bbox, ref]
}

/**
 * @method useOnScreen
 * Based on https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
 * consulted on 2021-04-26
 *
 * Possible values: entry.boundingClientRect
 * entry.intersectionRatio
 * entry.intersectionRect, entry.isIntersecting, entry.rootBounds,
 * entry.target,
 * entry.time
 * usage
 *   const [entry, ref] = useOnScreen()
 *   <div ref={ref}>trigger {isIntersecting? 'visisble': 'not visible'}</div>
 *
 */
export function useOnScreen({ threshold = [0, 1], rootMargin = '0% 0% 0% 0%' } = {}) {
  const ref = useRef()
  const [entry, setEntry] = useState({
    intersectionRatio: 0, // this avoid entry is null error
    isIntersecting: false,
  })
  const observer = new IntersectionObserver(
    ([b]) => {
      setEntry(b)
    },
    {
      threshold,
      rootMargin,
    },
  )
  useEffect(() => {
    observer.observe(ref.current)
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line
  }, [])
  return [entry, ref]
}
