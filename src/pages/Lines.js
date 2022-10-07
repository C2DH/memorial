import { useQueryParam, withDefault } from 'use-query-params'
import LinesMap from '../components/LinesMap'
import { StatusSuccess, useGetJSON } from '../hooks/data'
import { useCurrentWindowDimensions } from '../hooks/viewport'
import { QParam } from '../logic/params'

const Lines = ({ isMobile }) => {
  const { width, height } = useCurrentWindowDimensions(isMobile)
  const [q] = useQueryParam('q', withDefault(QParam, ''))

  const params = {
    filters: {
      data__type: 'place',
    },
    detailed: true,
    limit: 1000,
  }

  if (q.length > 2) {
    params.q = q
  }
  const { data, status, error } = useGetJSON({
    url: '/api/document',
    params,
  })

  return (
    <LinesMap
      className="position-absolute top-0"
      places={status !== StatusSuccess ? [] : data.results}
      width={width}
      height={height}
    />
  )
}
export default Lines
