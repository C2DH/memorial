import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useQueryParam, withDefault } from 'use-query-params'
import { QParam, SlugParam } from '../logic/params'
import SearchStories from '../components/SearchStories'
import { BootstrapStartColumnLayout, BootstrapEndColumnLayout } from '../constants'
import { useTranslation } from 'react-i18next'
import SearchField from '../components/SearchField'
import { StatusSuccess } from '../hooks/data'

const Biographies = () => {
  const { t, i18n } = useTranslation()
  const [q, setQuery] = useQueryParam('q', withDefault(QParam, ''))
  const [author] = useQueryParam('author', withDefault(SlugParam, ''))
  let filters = {}
  if (author.length) {
    filters.authors__slug = author
  }
  if (q.length > 2) {
    filters.title__icontains = q.toLowerCase()
  }
  return (
    <div className="Biographies page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <h1>{t('pagesBiographiesTitle')}</h1>
            {/* {author.length ? author : 'all'}
            <button onClick={() => setAuthor(null)}>All</button> */}
            <SearchStories q={q} filters={filters} limit={100} />
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <SearchField
              status={StatusSuccess}
              defaultValue={q}
              onSubmit={(e, value) => setQuery(value)}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Biographies
