import React from 'react'
import { useParams } from 'react-router'
import { Container, Row, Col } from 'react-bootstrap'
import { useQueryParam, withDefault } from 'use-query-params'
import { QParam } from '../logic/params'

import SearchStories from '../components/SearchStories'
import SearchDocuments from '../components/SearchDocuments'
import { useBoundingClientRect } from '../hooks/viewport'

const Search = () => {
  const [bbox, ref] = useBoundingClientRect()
  const { what } = useParams()
  const [q] = useQueryParam('q', withDefault(QParam, ''))
  // if (!['all', 'stories'].includes(what)) {
  //   return null
  // }
  const columnHeight = bbox.windowDimensions.height - bbox.top - 50
  console.info('updating SearchPage', columnHeight, bbox.memo, what)
  return (
    <div className="Search page h-100">
      <Container>
        <Row>
          <Col>
            <h1>Stories</h1>
          </Col>
          {/*/}<Col>
            <h1>People</h1>
          </Col>/*/}
          <Col>
            <h1>Documents</h1>
          </Col>
        </Row>
        <Row
          ref={ref}
          className="border-top border-bottom border-dark"
          style={{ height: columnHeight }}
        >
          <Col className="h-100 border-dark" style={{ overflow: 'scroll' }}>
            {bbox.isReady && <SearchStories />}
          </Col>
          {/*/<Col className="h-100" style={{ overflow: 'scroll' }}>
            {bbox.isReady && (
              <SearchDocuments
                filters={{
                  data__type: 'person',
                }}
                q={q}
              />
            )}
          </Col>/*/}
          <Col className="h-100 " style={{ overflow: 'scroll' }}>
            {bbox.isReady && (
              <SearchDocuments
                filters={{
                  data__type__in: ['doc'],
                }}
                orderby="-id"
                q={q}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Search
