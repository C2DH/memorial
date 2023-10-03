import React from 'react'
import { useParams } from 'react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapStartColumnLayout } from '../constants'
import '../styles/pages/Page.css'
import { useGetJSON } from '../hooks/data'

import { useAvailableLanguage } from '../hooks/language'

const Page = ({ children }) => {
  const { pageId } = useParams()
  const { data: page } = useGetJSON({
    url: `/api/story/${pageId.replace(/[^\dA-Za-z-_]/g, '')}/`,
  })

  const { availableLanguage } = useAvailableLanguage({
    translatable: page?.data?.title,
  })
  console.debug('[Page] page:', page, availableLanguage)
  return (
    <div className="Page page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <h1 dangerouslySetInnerHTML={{ __html: page?.data.title[availableLanguage] }} />
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {page?.data.abstract[availableLanguage]}
            </ReactMarkdown>
          </Col>
          {children({ pageId })}
        </Row>
      </Container>
    </div>
  )
}

export default Page
