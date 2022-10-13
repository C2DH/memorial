import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
// import {
//   StatusError,
//   useGetJSON
// } from '../hooks/data'
import { useGetJSON, StatusSuccess } from '../hooks/data'
import { useAvailableLanguage } from '../hooks/language'
import StoryModule from '../components/StoryModule'
import StoryTimeline from '../components/StoryTimeline'
import { BootstrapStartColumnLayout, BootstrapEndColumnLayout } from '../constants'
import '../styles/pages/Story.css'
import StoryAuthors from '../components/StoryAuthors'
import TopDocuments from '../components/TopDocuments'
import GetInTouch from '../components/GetInTouch'

const Story = () => {
  const { t } = useTranslation()
  const { storyId } = useParams()
  const safeStoryId = storyId.replace(/[^\dA-Za-z-_]/g, '').toLowerCase()
  const {
    data: story,
    status,
    error,
  } = useGetJSON({
    url: `/api/story/${safeStoryId}`,
    params: { parser: 'yaml' },
  })
  const isValidStory = status === StatusSuccess && Array.isArray(story?.contents?.modules)
  const { availableLanguage } = useAvailableLanguage({
    translatable: status === StatusSuccess ? story.data.title : {},
  })
  console.debug(
    '[Story]',
    '\n - safeStoryId:',
    safeStoryId,
    '\n - story:',
    story,
    availableLanguage,
  )

  if (error) {
    console.error(error)
    return null
  }
  const isLongTitle = isValidStory && story.title.length > 30
  const isVeryLongTitle = isLongTitle && story.title.length > 100

  return (
    <div
      className={`Story page ${
        isVeryLongTitle ? 'very-long-title' : isLongTitle ? 'long-title' : ''
      }`}
    >
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            {isValidStory &&
              story.contents.modules.map((d, i) => {
                return (
                  <section key={i} className="Story_StoryModule">
                    <StoryModule language={availableLanguage} {...d} />
                    {i === 0 && (
                      <>
                        <StoryAuthors authors={story.authors}></StoryAuthors>

                        <TopDocuments
                          className="Story_TopDocuments mt-3"
                          params={{
                            filters: {
                              data__household__startswith: safeStoryId.split('-', 1)[0],
                            },
                          }}
                          hideIfEmpty
                        >
                          <label className="text-uppercase small fw-bold">
                            {t('people')}&nbsp;
                          </label>
                        </TopDocuments>
                      </>
                    )}
                  </section>
                )
              })}
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

            <div className="mb-5" style={{ textAlign: 'left' }}>
              <GetInTouch />
            </div>
            {/* <div className="mb-3" style={{ textAlign: 'right' }}>
              <Button>{t('actionAddAPebble')}</Button>
            </div> */}
            <StoryTimeline storyId={safeStoryId} />
            <div className="position-sticky top-page"></div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Story
