import { useRef, useEffect } from 'react'

const GenericIntersectionObserver = ({ onIntersect, delay = 500 }) => {
  const ref = useRef(null)

  useEffect(() => {
    const obj = ref.current
    let debounceTimer = null
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(debounceTimer)
        if (entry.isIntersecting) {
          debounceTimer = setTimeout(() => {
            onIntersect()
          }, 500)
        } else {
          clearTimeout(debounceTimer)
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      },
    )

    if (obj) {
      observer.observe(obj)
    }

    return () => {
      clearTimeout(debounceTimer)
      if (obj) {
        observer.unobserve(obj)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} class="py-5 text-center mt-5">
      &nbsp;
    </div>
  )
}

export default GenericIntersectionObserver
