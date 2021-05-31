import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useCurrentWindowDimensions } from '../hooks'
import { useStory } from '@c2dh/react-miller'
import { useParams } from 'react-router-dom'
import Person from '../models/Person'

const BootstrapColumLayout = Object.freeze({
  md: { span:8, offset:2 },
  lg: { span:8, offset:2 }
})

const Story = () => {
  const { t, i18n } = useTranslation()
  const { height } = useCurrentWindowDimensions()
  // params
  const { slug } = useParams()
  const [story] = useStory(slug, { parser: 'yaml' }, {
    language: i18n.language,
  })
  const people = (story?.documents ?? [])
    .filter(d => d.data.type==='person')
    .map(d => new Person({
      firstName: d.data.first_name,
      lastName: d.data.last_name,
      professions: d.data.professions,
      birthDate: d.data.birth_date,
      birthPlace: d.data.birth_place,
      deathDate: d.data.death_date,
      deathPlace: d.data.death_place,
      notes: d.data.notes,
    }))

  const modules = story?.contents?.modules || []
  return (
    <div className="Story my-5" style={{minHeight: height}}>

      {story && (<Container >
        <Row>
          <Col {...BootstrapColumLayout}>
            <h1 className="my-5 font-weight-bold display-2">{story.data.title}</h1>
            <Container fluid>
              <Row>
                {people.map((person, i) => (
                  <Col key={i}><div>
                    <span className="capitalize">{person.lastName} <b>{person.firstName}</b></span>,
                    <span> {person.professions.join(', ')}</span>
                     was born in {person.birthPlace} the {person.birthDate}
                    <div className="small p-2">
                      {person.notes}
                    </div>
                  </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    )}

      {modules.map((m, i) => (
        <Container className="mt-5" key={i}>
          <Row>
            <Col {...BootstrapColumLayout}>{m.text.content}</Col>
          </Row>
        </Container>
      ))}
    </div>
  )
}

export default Story
