import React from 'react'
import { useParams } from 'react-router'
import { useStory } from '@c2dh/react-miller'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumnLayout } from '../constants'
import '../styles/pages/Page.css'

const Page = () => {
  const { pageId } = useParams()
  const [page] = useStory(pageId.replace(/[^\dA-Za-z-_]/g, ''))

  return (
    <div className="Page page">
      <Container>
        <Row>
          <Col {...BootstrapColumnLayout}>
            <h1>{page?.data.title}</h1>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{page?.data.abstract}</ReactMarkdown>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Page
