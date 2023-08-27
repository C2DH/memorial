import React from 'react'
import { useParams } from 'react-router'
import { useStory } from '@c2dh/react-miller'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapStartColumnLayout } from '../constants'
import '../styles/pages/Page.css'

const Page = ({ children }) => {
  const { pageId } = useParams()
  const [page] = useStory(pageId.replace(/[^\dA-Za-z-_]/g, ''))

  return (
    <div className="Page page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <h1 dangerouslySetInnerHTML={{ __html: page?.data.title }} />
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{page?.data.abstract}</ReactMarkdown>
          </Col>
          {children({ pageId })}
        </Row>
      </Container>
    </div>
  )
}

export default Page
