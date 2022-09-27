import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSprings, useSpring, a, config } from 'react-spring'
import { Container, Row, Col } from 'react-bootstrap'
import LangLink from '../components/LangLink'
import TopStories from '../components/TopStories'
// import TopDocuments from '../components/TopDocuments'
import {
  BootstrapStartColumnLayout,
  BootstrapEndColumnLayout,
  BootstrapColumnLayout,
} from '../constants'
import '../styles/pages/Home.css'
import HomeLandscape from '../components/HomeLandscape'
import GetInTouch from '../components/GetInTouch'
import { useCurrentWindowDimensions } from '../hooks/viewport'
// import { useGetJSON } from '../hooks/data'

const to = (i) => ({
  opacity: 1,

  delay: i * 500 + Math.random() * 4500,
})
const from = () => ({ opacity: 0.21 })

const Home = () => {
  const { t } = useTranslation()
  const { width, height } = useCurrentWindowDimensions()
  const words = String(t('pagesHomeSubheading')).split(' ')
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
        <div className="scroll-container mx-auto mt-5">
          <div className="scroller"></div>
        </div>
      </div>
      <Container className="Home page" style={{ minHeight: height * 2 - 160 }}>
        <Row>
          <Col {...BootstrapColumnLayout}>
            <a.div
              className="w-100"
              style={{
                transform: offset.to((o) => `translateY(${o * 0.35}px)`),
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
      </Container>

      {/* <div className="bg-secondary"> */}
      <Container>
        <Row className="my-4 ">
          <Col {...BootstrapColumnLayout}>
            <a.div
              style={{
                transform: offset.to((o) => `translateY(${o * -0.15}px)`),
              }}
            >
              <div
                className="my-3 text-dark"
                dangerouslySetInnerHTML={{ __html: t('pagesHomeParagraphA') }}
              />
              <p className="mt-5">
                <LangLink to="/biographies">
                  <button lg className="btn btn-white btn-lg">
                    {t('allStories')}
                  </button>
                </LangLink>
              </p>
            </a.div>
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
        <Row className="my-4 ">
          <Col {...BootstrapColumnLayout}>
            <h2 className="Home_outlined">Les biographies</h2>
            <TopStories
              className="Home_topStories"
              olClassName=" d-flex"
              params={{
                exclude: { tags__name: 'static' },
              }}
            >
              <section className="mb-3">
                <p dangerouslySetInnerHTML={{ __html: t('topStoriesIntro') }} />
              </section>
              <section className="mb-5">
                <LangLink to="/biographies">
                  <button className="btn btn-white">{t('allStories')}</button>
                </LangLink>
              </section>
            </TopStories>
          </Col>
        </Row>
      </Container>
      {/* </div> */}
      {/* <Container className="mt-5">
        <Row>
          <Col {...BootstrapColumnLayout}>
            <h2>Trouver les documents d'archive</h2>
            <section className="mb-3">
              <p dangerouslySetInnerHTML={{ __html: t('topStoriesIntro') }} />
            </section>
            <section className="mb-5">
              <LangLink to="/biographies">
                <Button>{t('allStories')}</Button>
              </LangLink>
            </section>
          </Col>
        </Row>
      </Container> */}
    </>
  )
}
export default Home
