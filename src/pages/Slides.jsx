import { useParams } from 'react-router-dom'
import { useGetJSON } from '../hooks/data'
import { useAvailableLanguage } from '../hooks/language'
import LogoC2dhUnilu from '../components/LogoC2dhUnilu'
import Logo from '../components/Logo'
import LogoFondation from '../components/LogoFondation'
import LogoLePremierConvoi from '../components/LogoLePremierConvoi'
import { Container, Row, Col } from 'react-bootstrap'
import './Slides.css'

const Slides = () => {
  const { pageId } = useParams()
  const { data: page } = useGetJSON({
    url: `/api/story/${pageId.replace(/[^\dA-Za-z-_]/g, '')}/`,
  })

  const { availableLanguage } = useAvailableLanguage({
    translatable: page?.data?.title,
  })

  if (!page) return null

  const title = page.data.title[availableLanguage]
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
          <h2>Journée d'études</h2>
        </div>

        <h5>
          Abbaye Neimënster
          <br />
          <span>13 octobre 2023</span>
        </h5>

        <h5>
          Salle Edmond Dune
          <br />
          <span>9.00-17.00</span>
        </h5>
      </div>
      <div className="Slides__body">
        <Container fluid className="p-0 my-3">
          <Row className="Slides__body__row">
            <Col md={{ span: 4 }} sm={{ span: 12 }}>
              <div className="Slides__body__image">
                <img src="/img/lukmanski-carmen.png" alt="alt" />
              </div>
            </Col>
            <Col md={{ span: 8 }} sm={{ span: 12 }}>
              <div>
                <h1>
                  Henriette/Henny SCHEIBERG-UHLMANN (1888-1942), Emil UHLMANN (1879 - 1942), Amalia
                  SCHEIBERG-OBERMAYER (1895-1944), Siegfried OBERMEYER (1883-1942)
                </h1>
                <h5 className="my-4">
                  WRITTEN BY &nbsp;&nbsp;<span>Maja Veyrat geb. Andert / Denis Scuto</span>
                </h5>
                <p>{abstract}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
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
              <span>
                Les biographies des familles déportées le 16 octobre 1941 de Luxembourg au ghetto de
                Litzmannstadt (Lodz) sur memorialshoah.lu
              </span>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  )
}
export default Slides
