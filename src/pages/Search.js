import React from 'react'
import { useParams } from 'react-router'
import { useStories } from '@c2dh/react-miller'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import LangLink from '../components/LangLink'
import {
  BootstrapColumnLayout,
  BootstrapStartColumnLayout
} from '../constants'


const SearchStories = () => {
  const [data, meta] = useStories({
    params: {
      exclude: {
        tags__slug: 'static'
      }
    },
    suspense: false
  })
  const {
    count,
    results:stories
  } = data ? data : {}
  return (
    <Container>
      <Row>
        <Col {...BootstrapStartColumnLayout}>
          <ol>
            {Array.isArray(stories) && stories.map((s, i) => (
              <li key={s.slug}>
                <h2>
                  <LangLink to={`/story/${s.slug}`}>
                    {s.data.title}
                  </LangLink></h2>
                <p>{s.data.abstract}</p>
              </li>
            ))}
          </ol>
        </Col>
      </Row>
    </Container>
  )
}

const Search = () => {
  const { what } = useParams()
  if (!['all', 'stories'].includes(what)) {
    return null
  }
  return (
    <div className="Search page">
      <Container>
        <Row>
          <Col {...BootstrapColumnLayout}>
            <h1>search!</h1>
          </Col>
        </Row>
      </Container>
      {what === 'stories' && <SearchStories />}
    </div>
  )
}

export default Search
