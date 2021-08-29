import React from 'react'
import { useStories } from '@c2dh/react-miller'
import { useTranslation } from 'react-i18next'
import { Card, Container, Row, Col } from 'react-bootstrap'
import LangLink from './LangLink'


const StoriesReel = ({ height }) => {
  const { t, i18n } = useTranslation()
  const [stories,, { error, loading }] = useStories({ parser: 'yaml' }, {
    language: i18n.language.split('-').join('_'),
    defaultLanguage: i18n.options.defaultLocale,
    cached: false,
  })
  if (!stories) {
    console.info('loading', loading)
    return null
  }
  if (error) {
    console.error('error', error)
    return null
  }
  return (
    <>

    {t('Stories')} {height}
    <Container>
      <Row>
      {stories.map(story => (
        <Col md={{span:4}} key={story.id}>
        <LangLink to={`story/${story.slug}`}>
        <Card key={story.id}>
        <Card.Body>
          <Card.Img variant="top"
          src="https://via.placeholder.com/350/0000FF/808080?Text=image" />
          <Card.Title className="mt-3">
            {story.data.title}</Card.Title>
          <Card.Text>
             {story.data.abstract}
          </Card.Text>
        </Card.Body>
        </Card>
        </LangLink>
        </Col>
      ))}
      </Row>
      </Container>
      <pre>{JSON.stringify(stories, null, 2)}</pre>
    </>
  )
}

export default StoriesReel
