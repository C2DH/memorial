import React from 'react'
import { useParams } from 'react-router'
import { useStory } from '@c2dh/react-miller'
import ReactMarkdown from 'react-markdown'
import { Container, Row, Col, Button } from 'react-bootstrap'
import {
  BootstrapStartColumnLayout,
} from '../constants'

const Page = () => {
  const { pageId } = useParams()
  const safePageId = pageId.replace(/[^\dA-Za-z-_]/g, '')

  const [ page ] = useStory(pageId);

  return (
    <div className="Page page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <h1>{page?.data.title}</h1>
            <ReactMarkdown>{page?.data.abstract}</ReactMarkdown>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Page
