import React, { useLayoutEffect, useRef } from 'react'
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useQueryParam, withDefault } from 'use-query-params'
import { BootstrapStartColumnLayout, BootstrapEndColumnLayout } from '../constants'
import { useGetJSON, StatusFetching, StatusSuccess } from '../hooks/data'
import { QParam } from '../logic/params'
import Person from '../components/Person'
import '../styles/pages/People.css'

const People = () => {
  const { t } = useTranslation()
  const searchQueryRef = useRef()
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
  useLayoutEffect(() => {
    if (searchQueryRef.current) {
      searchQueryRef.current.focus()
    }
  }, [status])
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
            <Form
              className="mt-5"
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQueryRef.current && searchQueryRef.current.value.length > 1) {
                  setQuery(searchQueryRef.current.value)
                } else {
                  setQuery(undefined)
                }
              }}
            >
              <InputGroup size="lg">
                <Form.Control
                  placeholder={t('pagesPeopleSearchPlaceholder')}
                  aria-label={t('pagesPeopleSearchPlaceholder')}
                  aria-describedby="basic-addon2"
                  defaultValue={q}
                  ref={searchQueryRef}
                  className="People_inputSearchQuery"
                />
                <button className="btn btn-white btn-lg People_inputSubmit" id="button-addon2">
                  {t(status === StatusFetching ? 'loading' : 'actionSearchPerson')}
                </button>
              </InputGroup>
            </Form>
            {/* <p dangerouslySetInnerHTML={{ __html: t('pagesPeopleSubheading') }} /> */}
          </Col>
        </Row>
      </Container>
      <ol>
        {status === StatusSuccess &&
          data.results.map((person) => {
            return (
              <li className="People_listItem" key={person.slug}>
                <Person doc={person} />
              </li>
            )
          })}
      </ol>
    </div>
  )
}
export default People
