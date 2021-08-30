import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useCurrentWindowDimensions } from '../hooks'
import { useDocument, useDocuments, useStories } from '@c2dh/react-miller'
import { useParams } from 'react-router-dom'
import DocumentViewerPerson from '../components/DocumentViewer/DocumentViewerPerson'
import ErrorPage from './ErrorPage'
import {BootstrapColumLayout} from '../constants'
import Person from '../models/Person'
import LangLink from '../components/LangLink'
const PersonRelatedStory = ({person, doc}) => {
  const { i18n } = useTranslation()
  const [stories, pagination, { error, loading }] = useStories({
    limit: 100,
    offset: 0,
    // q,
    // filters: {
    //   data__type: 'person',
    //   data__households__contains: household,
    // },
  }, {
    language: i18n.language.split('-').join('_'),
    defaultLanguage: i18n.options.defaultLocale,
  })
  return (
    <Container className="my-5">
      <Row>
        {(stories || []).map((d, i) => (
          <Col key={i}>
            <LangLink to={`/story/${d.slug}`}>
              <h3>{d.data.title}</h3>
              <blockquote>{d.data.abstract}</blockquote>
              {d.date_created}
            </LangLink>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

const PersonRelatedPeople = ({ person, household }) => {
  const { i18n } = useTranslation()
  const [neighbors, pagination, { error, loading }] = useDocuments({
    limit: 100,
    offset: 0,
    // q,
    filters: {
      data__type: 'person',
      data__households__contains: household,
    },
  }, {
    language: i18n.language.split('-').join('_'),
    defaultLanguage: i18n.options.defaultLocale,
  })
  if(error) {
    return (<pre>{JSON.stringify(error, null, 2)}</pre>)
  }
  if(!neighbors || !neighbors.length) {
    return null
  }
  return (
    <Container className="my-5">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h3>household: {household}</h3>
        </Col>
      </Row>
      <Row>
        {neighbors.filter(d => d.slug !== person.slug).map((d, i) => (
          <Col key={i} {...BootstrapColumLayout}>
            <DocumentViewerPerson doc={d} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

const PersonPage = ({ match: { params: { slug }}}) => {
  const { i18n } = useTranslation()
  const { height } = useCurrentWindowDimensions()

  const [doc, { error, pending }] = useDocument(slug, {
    language: i18n.language,
  })
  if (error) {
    return <ErrorPage error={error}/>
  }
  const person = doc ? Person.create(doc) : null
  return (
    <div className="Person" style={{minHeight: height}}>
      <Container className="my-5">
        <Row>
          <Col {...BootstrapColumLayout}>
            <h1 className="my-5 font-weight-bold display-2">{person?.firstName}</h1>
            <DocumentViewerPerson doc={doc} />
          </Col>
        </Row>
      </Container>
      {person ?
      (
        <>
        <PersonRelatedStory person={person} doc={doc}/>
        {person.households.map(household => (
          <PersonRelatedPeople key={household} person={person} household={household} />
        ))}
        </>
      ): null}

      {/*
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
        */}
    </div>
  )
}

export default PersonPage
