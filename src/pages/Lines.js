import { Container, Row, Col } from 'react-bootstrap'
import { useQueryParam, withDefault } from 'use-query-params'
import LinesMap from '../components/LinesMap'
import { StatusSuccess, useGetJSON } from '../hooks/data'
import { useCurrentWindowDimensions } from '../hooks/viewport'
import { QParam } from '../logic/params'
import { BootstrapStartColumnLayout } from '../constants'
import { useTranslation } from 'react-i18next'

const LinesMapWithEvents = ({ width, height, places = [], className = '' }) => {
  const [q] = useQueryParam('q', withDefault(QParam, ''))
  const params = {
    filters: {
      data__type: 'person',
      data__has_events: true,
    },
    limit: 1000,
  }

  if (q.length > 2) {
    params.q = q
  }
  const { data, status, error } = useGetJSON({
    url: '/api/document',
    params,
  })
  const eventsByPlace =
    status !== StatusSuccess
      ? {}
      : data.results.reduce((acc, person) => {
          person.data.events.forEach((e) => {
            if (!acc[e.place.slug]) {
              acc[e.place.slug] = {
                count: 1,
                events: [[person.slug, e.label]],
              }
            } else {
              acc[e.place.slug].count += 1
              acc[e.place.slug].events.push([person.slug, e.label])
            }
          })
          return acc
        }, {})

  console.debug('[LinesMapWithEvents] status:', status, 'eventsByPlace:', eventsByPlace)
  if (status !== StatusSuccess) {
    return 'loading events...'
  }
  return (
    <LinesMap
      className={className}
      places={places}
      people={[data.results[0], data.results[1]]}
      eventsByPlace={eventsByPlace}
      events={data.results}
      width={width}
      height={height}
    />
  )
}

const Lines = ({ isMobile }) => {
  const { width, height } = useCurrentWindowDimensions(isMobile)
  const { t } = useTranslation()
  const params = {
    filters: {
      data__type: 'place',
    },
    detailed: true,
    limit: 1000,
  }

  const { data, status, error } = useGetJSON({
    url: '/api/document',
    params,
  })
  if (status !== StatusSuccess) {
    return null
  }
  return (
    <div className="Lines page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <h1 dangerouslySetInnerHTML={{ __html: t('pagesLinesTitle') }} />
          </Col>
        </Row>
      </Container>
      <div className="position-relative" style={{ height }}>
        <LinesMapWithEvents
          className="position-absolute top-0"
          places={data.results}
          width={width}
          height={height}
        ></LinesMapWithEvents>
      </div>
    </div>
  )
}
export default Lines
