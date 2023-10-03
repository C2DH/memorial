import { useEffect, useState } from 'react'

const PagefindMatch = ({ id, getData, children }) => {
  const [result, setResult] = useState(null)

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const result = await getData()
      // ...
      setResult(result)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return <div>{result ? <>{children(result)}</> : <div>Loading...</div>}</div>
}

export default PagefindMatch
