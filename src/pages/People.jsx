import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useQueryParam, withDefault } from 'use-query-params'
import { BootstrapStartColumnLayout, BootstrapEndColumnLayout } from '../constants'
import { useGetJSON, StatusSuccess } from '../hooks/data'
import { QParam } from '../logic/params'
import Person from '../components/Person'
import '../styles/pages/People.css'
import SearchField from '../components/SearchField'

const People = () => {
  const { t } = useTranslation()
  const [q, setQuery] = useQueryParam('q', withDefault(QParam, ''))
  const params = {
    filters: {
      data__type: 'person',
    },
    limit: 1000,
  }

  if (q.length > 1) {
    params.q = q
  }
  const { data, status, error } = useGetJSON({
    url: '/api/document',
    params,
    delay: 0,
  })
  if (error) {
    console.warn('[People] error:', error)
  }
  return (
    <div className="People page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <h1 dangerouslySetInnerHTML={{ __html: t('pagesPeopleTitle') }} />
            {status === StatusSuccess && (
              <h2
                className="People_numResults mb-3 pb-3"
                dangerouslySetInnerHTML={{
                  __html: t(q.length > 1 ? 'peopleCountWithQuery' : 'peopleCount', {
                    n: data.count,
                    q,
                  }),
                }}
              />
            )}
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <SearchField
              status={status}
              defaultValue={q}
              onSubmit={(e, value) => setQuery(value)}
            />
            {/* <p dangerouslySetInnerHTML={{ __html: t('pagesPeopleSubheading') }} /> */}
          </Col>
        </Row>
      </Container>
      <ol>
        {status === StatusSuccess &&
          data.results.map((person, i) => {
            return (
              <li className="People_listItem" key={i}>
                <Person doc={person} withLinks />
              </li>
            )
          })}
      </ol>
    </div>
  )
}
export default People
