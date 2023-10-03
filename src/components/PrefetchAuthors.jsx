import { useEffect } from 'react'
import { useGetJSON } from '../hooks/data'
import { useStore } from '../store'

const PrefetchAuthors = () => {
  // load authro data from api
  const {
    data: authorMetadata,
    status,
    error,
  } = useGetJSON({
    url: `/api/author/`,
    params: {
      limit: 1000,
    },
    delay: 1000,
  })

  const setAuthors = useStore((state) => state.setAuthors)
  if (error) {
    console.warn('[PrefetchAuthors] error:', error)
  }
  useEffect(() => {
    if (status !== 'success') {
      return
    }
    console.info('[PrefetchAuthors] authorMetadata:', authorMetadata)
    setAuthors(authorMetadata.results)
     
  }, [status])
}

export default PrefetchAuthors
