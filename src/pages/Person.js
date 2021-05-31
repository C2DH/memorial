import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useCurrentWindowDimensions } from '../hooks'
import { useDocument, useDocuments } from '@c2dh/react-miller'
import { useParams } from 'react-router-dom'
import DocumentViewerPerson from '../components/DocumentViewer/DocumentViewerPerson'


const BootstrapColumLayout = Object.freeze({
  md: { span:8, offset:2 },
  lg: { span:8, offset:2 }
})

const BootstrapMultiColumnLayout = {
  md: {span: 6},
}

const PersonPage = () => {
  const { i18n } = useTranslation()
  const { height } = useCurrentWindowDimensions()

  const { slug } = useParams()
  const [person, { error, pending }] = useDocument(slug, {
    language: i18n.language,
  })

  const [neighbors, pagination, { loading }] = useDocuments({
    limit: 100,
    offset: 0,
    // q,
    filters: {
      data__type: 'person',
      data__households__contains: person?.data?.households[0] || [],
    },
  }, {
    language: i18n.language.split('-').join('_'),
    defaultLanguage: i18n.options.defaultLocale,
  })

  return (
    <div className="Person" style={{minHeight: height}}>
      <Container className="my-5">
        <Row>
          <Col {...BootstrapColumLayout}>
            <h1 className="my-5 font-weight-bold display-2">{person?.data?.first_name}</h1>
            <DocumentViewerPerson person={person}/>
          </Col>
        </Row>
        <Row>
          <Col {...BootstrapColumLayout}>
            <Container fluid className="my-5 p-0">
              <Row>
              {(neighbors || []).filter(d=> d.slug !== slug).map((p, i) => (
                <Col key={i} {...BootstrapMultiColumnLayout}>
                  <DocumentViewerPerson  person={p}/>
                </Col>
              ))}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default PersonPage
