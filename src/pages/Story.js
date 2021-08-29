import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useCurrentWindowDimensions } from '../hooks'
import { useStory } from '@c2dh/react-miller'
import Person from '../models/Person'

const BootstrapColumLayout = Object.freeze({
  md: { span:8, offset:2 },
  lg: { span:8, offset:2 }
})

const Story = ({ match: { params: { slug }}}) => {
  const { t, i18n } = useTranslation()
  const { height } = useCurrentWindowDimensions()
  // params
  const [story] = useStory(slug, { parser: 'yaml' }, {
    language: i18n.language,
  })

  const modules = story?.contents?.modules || []
  return (
    <div className="Story" style={{minHeight: height}}>
      {story && (
        <Container >
          <Row>
            <Col {...BootstrapColumLayout}>
              <h1 className="my-5 font-weight-bold display-2">{story.data.title}</h1>
            </Col>
          </Row>
        </Container>
      )}
      {modules.map((m, i) => (
        <Container className="mt-5" key={i}>
          <Row>
            <Col {...BootstrapColumLayout}>{m.text.content}
              {JSON.stringify(m, null, 2)}
            </Col>
          </Row>
        </Container>
      ))}
    </div>
  )
}

export default Story
