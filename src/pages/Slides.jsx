import { useParams } from 'react-router-dom'
import { StatusSuccess, useGetJSON } from '../hooks/data'
import { useAvailableLanguage } from '../hooks/language'
import LogoC2dhUnilu from '../components/LogoC2dhUnilu'
import LogoFondation from '../components/LogoFondation'
import LogoLePremierConvoi from '../components/LogoLePremierConvoi'
import { Container, Row, Col } from 'react-bootstrap'
import './Slides.css'
import GalleryOfStories from '../components/GalleryOfStories'
import { LogoMemorial } from '../components/Hero/ui/Logo'
import { getTranslatedObject } from '../logic/language'
import { useTranslation } from 'react-i18next'

const Slides = () => {
  const { t } = useTranslation()
  const { pageId } = useParams()
  const { data: page, status: pageStatus } = useGetJSON({
    url: `/api/story/${pageId.replace(/[^\dA-Za-z-_]/g, '')}/`,
  })
  const { availableLanguage } = useAvailableLanguage({
    translatable: page?.data?.title,
  })

  const params =
    page && Array.isArray(page.data.households)
      ? {
          filters: JSON.stringify({
            slug__in: page.data.households.map((d) => String(d).toLowerCase()),
          }),
          limit: 100,
        }
      : {}

  console.debug(
    '[Slides]',
    '\n - pageStatus:',
    pageStatus,
    '\n - pageId:',
    pageId,
    '\n - params:',
    params,
  )
  const { data: stories, status: storiesStatus } = useGetJSON({
    url: `/api/story/`,
    params,
    enabled: pageStatus === StatusSuccess,
  })

  if (!page) return null

  const title = getTranslatedObject(page.data.title, availableLanguage)
  const subtitle = getTranslatedObject(page.data.subtitle, availableLanguage)
  const abstract = getTranslatedObject(page.data.abstract, availableLanguage)
  const location = getTranslatedObject(page.data.location, availableLanguage)
  const preciseLocation = getTranslatedObject(page.data.preciseLocation, availableLanguage)
  const preciseTime = getTranslatedObject(page.data.time, availableLanguage)

  return (
    <div className="Slides">
      <div className="Slides__header align-items-center">
        <LogoMemorial className="position-absolute" width={150} color="var(--bs-primary)" />
        <div className="Slides__title w-50">
          {page.tags.find((d) => d.slug === 'first-convoy') ? (
            <LogoLePremierConvoi size={'600'} />
          ) : (
            <h1 className="font-weight-bold">{title}</h1>
          )}
        </div>

        <h5>
          {location}
          <br />
          <span>{t('dateShort', { date: new Date(page.date) })}</span>
        </h5>

        <h5>
          {preciseLocation}
          <br />
          <span>{preciseTime}</span>
        </h5>
      </div>
      <main className="flex-grow-1">
        {storiesStatus === StatusSuccess ? (
          <GalleryOfStories
            className="h-100"
            language={availableLanguage}
            stories={stories.results}
          />
        ) : (
          <div>Loading</div>
        )}
      </main>
      <footer>
        <Container fluid className="p-0 my-3">
          <Row className="Slides__body__row">
            <Col md={{ span: 4 }} sm={{ span: 12 }}>
              <div className="footerLogos">
                <LogoC2dhUnilu color="var(--bs-dark)" style={{ marginRight: '2rem' }} />
                <div className="mt-2">
                  <LogoFondation size="120" />
                </div>
              </div>
            </Col>
            <Col md={{ span: 8 }} sm={{ span: 12 }}>
              <h3 dangerouslySetInnerHTML={{ __html: abstract }} />
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  )
}
export default Slides
