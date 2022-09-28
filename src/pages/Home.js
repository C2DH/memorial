import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSprings, useSpring, a, config } from 'react-spring'
import { Container, Row, Col } from 'react-bootstrap'
import LangLink from '../components/LangLink'
// import TopDocuments from '../components/TopDocuments'
import HomeBiographies from '../components/HomeBiographies'
import { BootstrapColumnLayout } from '../constants'
import '../styles/pages/Home.css'
import HomeLandscape from '../components/HomeLandscape'
import GetInTouch from '../components/GetInTouch'
import { useCurrentWindowDimensions } from '../hooks/viewport'
import Logo from '../components/Logo'
// import { useGetJSON } from '../hooks/data'

const to = (i) => ({
  opacity: 1,

  delay: i * 500 + Math.random() * 4500,
})
const from = () => ({ opacity: 0.16 })

const Home = ({ isMobile }) => {
  const { t } = useTranslation()
  const { width, height } = useCurrentWindowDimensions(isMobile)
  const words = String(t('pagesHomeSubheading')).split(' ')
  const biographiesSpringSpeed = isMobile ? 0.2 : 0.25
  const [animatedWords] = useSprings(words.length, (i) => ({
    config: {
      duration: 2000,
    },
    loop: { reverse: true },
    ...to(i),
    from: from(),
  }))
  const [{ offset }, set] = useSpring(() => ({
    offset: 0,
    config: config.stiff,
  }))

  useEffect(() => {
    const handleScroll = () => {
      // const posY = ref.current.getBoundingClientRect().top;
      const offset = window.pageYOffset
      set({ offset })
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [set])

  return (
    <>
      <HomeLandscape availableWidth={width} availableHeight={height} />
      <div
        className="position-absolute w-100"
        onClick={() => {
          window.scrollTo({ top: height - 160, behaviour: 'smooth' })
        }}
        style={{ top: height - 160 }}
      >
        <a.div
          className="scroll-container mx-auto mt-5"
          style={{ opacity: offset.to((o) => (o > height / 3 ? 0 : 1)) }}
        >
          <div className="scroller"></div>
        </a.div>
      </div>
      <Container className="Home page">
        <Row
          style={{
            minHeight: isMobile ? height * 0.6 : height * 0.6,
            marginBottom: isMobile ? height * 0.25 : height * 0.25,
          }}
          className="align-items-center"
        >
          {isMobile ? null : (
            <Col sm={{ span: 3 }}>
              <Logo width={250} height={350} style={{ color: 'var(--bs-secondary)' }} />
            </Col>
          )}
          <Col>
            <a.div
              className="w-100"
              style={{
                transform: offset.to((o) => `translateY(${isMobile ? o * 0.5 : o * 0.35}px)`),
              }}
            >
              {animatedWords.map((w, i) => (
                <a.h2
                  className={`Home_animatedWord outlined display-2 d-inline-block m-0 ${
                    i === 0 ? 'first' : ''
                  } `}
                  style={w}
                  key={i}
                >
                  {words[i]}&nbsp;
                </a.h2>
              ))}
            </a.div>
          </Col>
        </Row>
        <Row>
          <Col {...BootstrapColumnLayout}>
            <Container fluid className="p-0 mb-5 mb-md-0">
              <Row>
                <Col md={{ span: 6 }} sm={{ span: 12 }}>
                  <a.div
                    style={{
                      transform: offset.to((o) => `translateY(${isMobile ? o * 0.17 : o * 0.2}px)`),
                    }}
                  >
                    <section className="my-3 text-primary Home_firstParagraph">
                      <p dangerouslySetInnerHTML={{ __html: t('pagesHomeParagraphA') }} />
                    </section>
                    <p className="mt-5">
                      <LangLink to="/biographies">
                        <button className="btn btn-white btn-lg">{t('allStories')}</button>
                      </LangLink>
                    </p>
                  </a.div>
                </Col>
                <Col></Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <a.div
        className="w-100"
        style={{
          minHeight: height,
          transform: offset.to((o) => `translateY(${o * biographiesSpringSpeed}px)`),
        }}
      >
        <HomeBiographies
          isMobile={isMobile}
          speed={biographiesSpringSpeed}
          availableWidth={width}
          availableHeight={height / 2}
        />
      </a.div>
      {/* <div className="bg-secondary"> */}
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
                  <div dangerouslySetInnerHTML={{ __html: t('pagesHomeParagraphC') }} />
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
