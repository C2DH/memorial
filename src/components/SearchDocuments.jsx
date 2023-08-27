import React from 'react'
import { useInfiniteDocuments } from '@c2dh/react-miller'
import { useOnScreen } from '../hooks/viewport'
import DocumentItem from './DocumentItem'
import '../styles/components/SearchDocuments.css'

const SearchDocuments = ({ q = '', filters = {}, limit = 20, orderby = '-id' }) => {
  const params = {
    filters,
    limit,
    orderby,
    detailed: true,
  }
  if (q.length > 0) {
    params.q = q
  }
  const [data, { isLoading, isSuccess, hasNextPage, fetchNextPage }] = useInfiniteDocuments({
    params,
  })
  const results = data?.pages.reduce((results, page) => results.concat(page.results), [])
  const count = parseInt(data?.pages[0]?.count || 0, 10)
  const [{ isIntersecting }, ref] = useOnScreen()
  console.info('isIntersecting', isIntersecting)
  React.useEffect(() => {
    let timeoutId = null
    const delayed = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        console.info('and the winner is', isIntersecting)
        fetchNextPage()
      }, 300)
    }
    if (isIntersecting && hasNextPage) {
      delayed()
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [isLoading, isIntersecting, hasNextPage, fetchNextPage])
  // React.useLayoutEffect(() => {
  //   let timer
  //   clearTimeout(timer)
  //   if (isSuccess) {
  //     console.info('ready!', count, results.length, isIntersecting)
  //     if (results.length < count && isIntersecting) {
  //       setTimeout(fetchNextPage, 1000)
  //     }
  //   }
  //   return () => clearTimeout(timer)
  // }, [isIntersecting, isSuccess, hasNextPage, count, results])
  return (
    <ol className="SearchDocuments">
      {isSuccess && count === 0 && <li>No results.</li>}
      {isSuccess &&
        count > 0 &&
        results.map((doc, i) => (
          <li key={doc.id} className="mt-2 ">
            <label className="small text-muted">
              {i + 1} / {count}
            </label>
            <DocumentItem doc={doc} />
          </li>
        ))}
      <li ref={ref} className="text-center small mt-2">
        {isLoading ? 'loading...' : hasNextPage ? '...' : '-'}
      </li>
    </ol>
  )
}

export default SearchDocuments
