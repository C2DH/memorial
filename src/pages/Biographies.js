import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useQueryParam, withDefault } from 'use-query-params'
import { QParam, SlugParam } from '../logic/params'
import SearchStories from '../components/SearchStories'
import { BootstrapStartColumnLayout } from '../constants'
import { useTranslation } from 'react-i18next'

const Biographies = () => {
  const { t } = useTranslation()
  const [q] = useQueryParam('q', withDefault(QParam, ''))
  const [author] = useQueryParam('author', withDefault(SlugParam, ''))
  let filters = {}
  if (author.length) {
    filters.authors__slug = author
  }
  return (
    <div className="Biographies Page page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <h1>{t('pagesBiographiesTitle')}</h1>
            {/* {author.length ? author : 'all'}
            <button onClick={() => setAuthor(null)}>All</button> */}
            <SearchStories q={q} filters={filters} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Biographies
