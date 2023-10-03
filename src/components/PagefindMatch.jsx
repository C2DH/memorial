import { useEffect, useState } from 'react'
import './PagefindMatch.css'

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

  return (
    <div className="PagefindMatch">{result ? <>{children(result)}</> : <div>Loading...</div>}</div>
  )
}

export default PagefindMatch
