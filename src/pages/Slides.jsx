import { useParams } from 'react-router-dom'
import { StatusSuccess, useGetJSON } from '../hooks/data'
import { useAvailableLanguage } from '../hooks/language'
import LogoC2dhUnilu from '../components/LogoC2dhUnilu'
import Logo from '../components/Logo'
import LogoFondation from '../components/LogoFondation'
import LogoLePremierConvoi from '../components/LogoLePremierConvoi'
import { Container, Row, Col } from 'react-bootstrap'
import './Slides.css'
import GalleryOfStories from '../components/GalleryOfStories'

const Slides = () => {
  const { pageId } = useParams()
  const { data: page, status: pageStatus } = useGetJSON({
    url: `/api/story/${pageId.replace(/[^\dA-Za-z-_]/g, '')}/`,
  })
  const { availableLanguage } = useAvailableLanguage({
    translatable: page?.data?.title,
  })

  const params =
    page && page.data.households
      ? { filters: JSON.stringify({ slug__in: page.data.households }), limit: 100 }
      : {}

  console.debug('[Slides]', '\n - pageStatus:', pageStatus, '\n - params:', params)
  const { data: stories, status: storiesStatus } = useGetJSON({
    url: `/api/story/`,
    params,
    enabled: pageStatus === StatusSuccess,
  })

  if (!page) return null

  // const title = page.data.title[availableLanguage]
  const subtitle = page.data.subtitle[availableLanguage]
  const abstract = page.data.abstract[availableLanguage]

  return (
    <div className="Slides">
      <div className="Slides__header">
        <Logo
          className="position-absolute"
          width={150}
          height={150}
          color="var(--bs-primary)"
          style={{ top: '14px', left: '-19px', marginLeft: 0 }}
        />
        <div className="Slides__title">
          <LogoLePremierConvoi size={'600'} />
          <h2>{subtitle}</h2>
        </div>

        <h5>
          Abbaye Neimënster
          <br />
          <span>13 octobre 2023</span>
        </h5>

        <h5>
          Salle José Ensch
          <br />
          <span>9.00-17.00</span>
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
