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
export const useCurrentWindowDimensions = (isMobile) => {
  let [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    let timeoutId = null
    const resizeListener = () => {
      clearTimeout(timeoutId)
      const dims = getWindowDimensions()
      if (isMobile) {
        console.debug('[useCurrentWindowDimensions] in mobile.', dims.width, windowDimensions.width)

        if (dims.width !== windowDimensions.width) {
          setWindowDimensions(dims)
        }
      } else {
        console.debug('[useCurrentWindowDimensions] Dimension changed to', dims, isMobile)
        timeoutId = setTimeout(() => setWindowDimensions(dims), 150)
      }
      // console.info('setWindowDimensions', dims)
    }
    window.addEventListener('resize', resizeListener)
    if (isMobile) {
      resizeListener()
    }
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', resizeListener)
    }
  }, [isMobile, windowDimensions.width])
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

export function isFullScreenElement(el) {
  if (el) {
    return Boolean(
      document.fullscreenElement === el ||
        document.mozFullScreenElement === el ||
        document.webkitFullscreenElement === el ||
        document.msFullscreenElement === el,
    )
  }

  return Boolean(
    document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      document.fullscreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen ||
      document.fullScreenMode,
  )
}

/* Doc:
https://pdcamargo.github.io/dreampact/docs/hooks/use-fullscreen
*/
// https://github.com/pdcamargo/dreampact/blob/master/src/hooks/useFullScreen/index.ts
export function useFullScreen(refElement) {
  const isClient = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  )
  const initialState = !isClient ? false : isFullScreenElement(refElement.current)
  const [fullScreen, setFullScreen] = useState(initialState)

  // access various open fullscreen methods
  function openFullScreen() {
    const el = (refElement && refElement.current) || document.documentElement

    if (el.requestFullscreen) return el.requestFullscreen()
    if (el.mozRequestFullScreen) return el.mozRequestFullScreen()
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen()
    if (el.msRequestFullscreen) return el.msRequestFullscreen()
  }

  // access various exit fullscreen methods
  function closeFullScreen() {
    if (document.exitFullscreen) return document.exitFullscreen()
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen()
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen()
    if (document.msExitFullscreen) return document.msExitFullscreen()
  }

  useEffect(() => {
    function handleChange() {
      setFullScreen(isFullScreenElement(refElement.current))
    }

    document.addEventListener('webkitfullscreenchange', handleChange, false)
    document.addEventListener('mozfullscreenchange', handleChange, false)
    document.addEventListener('msfullscreenchange', handleChange, false)
    document.addEventListener('MSFullscreenChange', handleChange, false) // IE11
    document.addEventListener('fullscreenchange', handleChange, false)

    return () => {
      document.removeEventListener('webkitfullscreenchange', handleChange)
      document.removeEventListener('mozfullscreenchange', handleChange)
      document.removeEventListener('msfullscreenchange', handleChange)
      document.removeEventListener('MSFullscreenChange', handleChange)
      document.removeEventListener('fullscreenchange', handleChange)
    }
  }, [refElement])

  return {
    fullScreen,
    open: openFullScreen,
    close: closeFullScreen,
    toggle: fullScreen ? closeFullScreen : openFullScreen,
  }
}
