import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook to dynamically load Pagefind search script
 * @returns {{ pagefindRef: React.MutableRefObject, isSearchReady: boolean }}
 */
export const usePagefind = () => {
  const pagefindRef = useRef(null)
  const [isSearchReady, setIsSearchReady] = useState(false)

  useEffect(() => {
    if (pagefindRef.current) {
      console.info('[usePagefind] Pagefind already loaded')
      return
    }
    console.info('[usePagefind] Pagefind loading')
    pagefindRef.current = true
    const script = document.createElement('script')
    script.src = '/pagefind/pagefind.js'
    script.async = true
    // use as import module
    script.type = 'module'

    script.onload = async () => {
      console.info('[usePagefind] Pagefind loaded successfully')
      const pagefind = await import(
        /* @vite-ignore */ `${window.location.origin}/pagefind/pagefind.js`
      )
      pagefindRef.current = pagefind
      setIsSearchReady(true)
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return { pagefindRef, isSearchReady }
}
