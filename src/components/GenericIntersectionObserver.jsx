import { useRef, useEffect } from 'react'

const GenericIntersectionObserver = ({ onIntersect }) => {
  const ref = useRef(null)

  useEffect(() => {
    const obj = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('Element is visible')
          obj.classList.add('bg-primary')
          onIntersect()
        } else {
          obj.classList.add('bg-transparent')
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
      if (obj) {
        observer.unobserve(obj)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} class="py-5 border-top border-dark text-center mt-5">
      Load More...
    </div>
  )
}

export default GenericIntersectionObserver
