import { Col, Container, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { BootstrapStartColumnLayout } from '../constants'
import { StatusSuccess, useGetJSON } from '../hooks/data'
import { useAvailableLanguage } from '../hooks/language'
import NotFound from './NotFound'

const Convoy = () => {
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
            {isValidStory ? 'loaded' : 'loading...'}
            {t('loading')}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Convoy
