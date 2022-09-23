import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname, hash } = useLocation()
  console.info('ScrollToTop pathname', pathname, 'hash', hash)
  useEffect(() => {
    let timer
    if (hash === '') {
      window.scrollTo(0, 0)
      // } else if(hash.indexOf('#p') === 0) {
      //   return;
      // } else {
    } else {
      timer = setTimeout(() => {
        // window.dispatchEvent(new Event('resize'))
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        console.info('ScrollToTop: reaching id =', id)
        if (element) {
          element.scrollIntoView()
          // window.scrollTo(0, element.offsetTop + 100) // window.innerHeight * 0.01)
        } else {
          console.warn('ScrollToTop: element not found using id =', id)
        }
      }, 500)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [pathname, hash])

  return null
}

export default ScrollToTop
