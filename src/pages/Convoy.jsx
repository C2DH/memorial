import { Col, Container, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { BootstrapEndColumnLayout, BootstrapStartColumnLayout } from '../constants'
import { StatusSuccess, useGetJSON } from '../hooks/data'
import { useAvailableLanguage } from '../hooks/language'
import NotFound from './NotFound'
import './Convoy.css'
import StoryModule from '../components/StoryModule'
import StoryEndnotes from '../components/StoryEndnotes'

const Convoy = () => {
  const { t } = useTranslation()
  const { convoyId } = useParams()
  const safeStoryId = convoyId.replace(/[^\dA-Za-z-_]/g, '')
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
    '[Convoy]',
    '\n - safeStoryId:',
    safeStoryId,
    '\n - story:',
    story,
    error,
    availableLanguage,
  )
  if (error && error.response && error.response.status === 404) {
    return <NotFound />
  }
  return (
    <div className="Convoy page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <label>{t('convoy')}</label>
            <h1>{isValidStory ? story.data.title[availableLanguage] : '...'}</h1>

            {isValidStory &&
              story.contents.modules.map((d, i) => {
                return (
                  <section key={i}>
                    <StoryModule
                      className={`Story_StoryModule ${i === 0 ? 'first' : ''}`}
                      language={availableLanguage}
                      {...d}
                    />
                  </section>
                )
              })}
            {isValidStory && (
              <StoryEndnotes
                className=" small mt-4 border-top border-dark pt-4 "
                language={availableLanguage}
                endnotes={story.contents.endnotes}
              />
            )}
          </Col>
          <Col {...BootstrapEndColumnLayout}></Col>
        </Row>
      </Container>
    </div>
  )
}

export default Convoy
