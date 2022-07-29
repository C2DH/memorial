import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
// import {
//   StatusError,
//   useGetJSON
// } from '../hooks/data'
import { useStory } from '@c2dh/react-miller'
import StoryModule from '../components/StoryModule'
import PreciseScrolling from '../components/PreciseScrolling'
import StoryTimeline from '../components/StoryTimeline'
import { BootstrapStartColumnLayout, BootstrapEndColumnLayout } from '../constants'
import '../styles/pages/Story.css'

const Story = () => {
  const { t } = useTranslation()
  const { storyId } = useParams()
  const safeStoryId = storyId.replace(/[^\dA-Za-z-_]/g, '')

  const [story] = useStory(safeStoryId)
  const isValidStory = Array.isArray(story?.contents?.modules)
  // const { data:story, status, error } = useGetJSON({
  //   url:`/api/story/${safeStoryId}`,
  //   params: { parser: 'yaml' },
  // })
  return (
    <div className="Story page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            {isValidStory &&
              story.contents.modules.map((module, i) => <StoryModule key={i} {...module} />)}
            {/*isValidStory && (
              <PreciseScrolling memoid={safeStoryId}>
                {story.contents.modules.map((module, i) => (
                  <StoryModule key={i} {...module} />
                ))}
              </PreciseScrolling>
            )*/}
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <div className="mt-5 mb-3">
              <b>{t('pagesStoryAdditionalInfo')}</b>
            </div>

            <div className="mb-3" style={{ textAlign: 'left' }}>
              <Button>{t('actionSendUsPageOfTestimony')}</Button>
            </div>
            <div className="mb-3" style={{ textAlign: 'right' }}>
              <Button>{t('actionAddAPebble')}</Button>
            </div>
            <StoryTimeline storyId={safeStoryId} />
            <div className="position-sticky top-page"></div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Story
