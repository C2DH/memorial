import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import LangLink from '../components/LangLink'
import { BootstrapColumnLayout } from '../constants'
import '../styles/pages/Home.css'
import Hero from '../components/Hero/Hero'
import GetInTouch from '../components/GetInTouch'
import PeopleCard from '../components/PeopleCard'
import { ArrowRightCircle } from 'react-feather'

const Home = () => {
  const { t } = useTranslation()

  return (
    <>
      <Suspense fallback={null}>
        <Hero />
      </Suspense>
      <PeopleCard debug src="/img/lukmanski-carmen.png"></PeopleCard>
      <Container className="Home page">
        <Row>
          <Col {...BootstrapColumnLayout}>
            <Container fluid className="p-0 mb-5 mb-md-0 pointer-events-auto">
              <Row>
                <Col md={{ span: 6 }} sm={{ span: 12 }}>
                  <div>
                    <section className="my-3 text-primary Home_firstParagraph">
                      <p dangerouslySetInnerHTML={{ __html: t('pagesHomeParagraphA') }} />
                    </section>
                    <p className="mt-5">
                      <LangLink to="/biographies">
                        <button className="btn btn-white btn-lg">
                          <span className="me-2">{t('allAvailableStories')} </span>
                          <ArrowRightCircle size={28} />
                        </button>
                      </LangLink>
                    </p>
                  </div>
                </Col>
                <Col></Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="my-4 ">
          <Col {...BootstrapColumnLayout}>
            <Container fluid className="p-0">
              <Row>
                <Col md={{ span: 6 }} sm={{ span: 12 }}>
                  <div
                    className="Home_firstParagraph"
                    dangerouslySetInnerHTML={{ __html: t('pagesHomeParagraphB') }}
                  />
                </Col>
                <Col>
                  <div
                    dangerouslySetInnerHTML={{ __html: t('pagesHomeParagraphC') }}
                    className="mb-5 mb-md-4"
                  />
                  <GetInTouch />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  )
}
export default Home
