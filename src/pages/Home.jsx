import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSprings, useSpring, a, config } from 'react-spring'
import { Container, Row, Col } from 'react-bootstrap'
import LangLink from '../components/LangLink'
// import TopDocuments from '../components/TopDocuments'
import HomeBiographies from '../components/HomeBiographies'
import { BootstrapColumnLayout } from '../constants'
import '../styles/pages/Home.css'
import HomeThreeLandscape from '../components/HomeThreeLandscape'
import GetInTouch from '../components/GetInTouch'
import { useCurrentWindowDimensions } from '../hooks/viewport'
import Logo from '../components/Logo'
import { Capsule, Dodecaedron, IcosahedronGeometry } from '../components/Pebble'
import PeopleCard from '../components/PeopleCard'
// import { useGetJSON } from '../hooks/data'
import { ArrowRightCircle } from 'react-feather'

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
  const [{ offset }, api] = useSpring(() => ({
    offset: 0,
    config: config.slow,
  }))

  const pebbles = [
    {
      title: 'Esther MEYER (1871-1942)',
      slug: '0014-esther-meyer',
      geometry: IcosahedronGeometry,
    },
    {
      title:
        'Aron-Samuel LUKMANSKI (1889-1942?), Frieda LUBINSTEIN (1888-1942?), Claire LUKMANSKI (1912-?), Henri Lukmanski (1915-1940), Jeanne Lukmanski (1921-1942?)',
      slug: '0147-lukmanski-lubinstein',
      geometry: Dodecaedron,
    },
    {
      title: 'Gerson Aronow (1888-1943), Sophie Herz (1897-1942)',
      slug: '0058-aronow-herz',
      geometry: IcosahedronGeometry,
    },
    {
      title:
        'Max GOLD (1900-1961), Reine PRESYTE (1909-?), Elka PRESYTE (1914-1943), Erika GOLD (1940-?)',
      slug: '0103-gold-presyte',
      geometry: IcosahedronGeometry,
    },
    {
      title: 'Rebecca genannt Rely LEVY (1898-1942)',
      slug: '0064-levy-rebecca',
      geometry: Dodecaedron,
    },
    {
      title: 'Sprinca DORFLAUFER (1907-1942?)',
      slug: '0127-dorflaufer',
      geometry: Capsule,
    },
    // {
    //   title:
    //     'Tobias Schlang (1902-1942), Anna Glaser (1895-1942), Sophie Schlang (1922-1942), Joseph Schlang (1924-2013)',
    //   slug: '0028-schlang-glaser',
    //   geometry: IcosahedronGeometry,
    // },
    {
      title: 'Paula et Maurice BLAU-ERMANN',
      slug: '0111-blau-ermann',
      geometry: IcosahedronGeometry,
    },
    {
      title:
        'Jakob Grossvogel (1893-1969), Rosa Macharowska (1895-1982), Samuel Grossvogel (1920-2009), Dina Grossvogel (1922-2014), Léon Grossvogel (1924-1945)',
      slug: '0076-grossvogel-macharowska',
      geometry: Dodecaedron,
    },
    {
      title: 'Fredy Abraham dit Brahms (1927-1944)',
      slug: '0109-abraham-fredy',
      geometry: IcosahedronGeometry,
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      // const posY = ref.current.getBoundingClientRect().top;
      const offset = window.pageYOffset
      api.set({ offset })
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [api])

  return (
    <>
      <React.Suspense fallback={null}>
        <HomeThreeLandscape pebbles={pebbles} availableWidth={width} availableHeight={height} />
      </React.Suspense>
      <PeopleCard debug src="/img/lukmanski-carmen.png"></PeopleCard>
      <div className="position-absolute w-100 pointer-events-none" style={{ top: height - 160 }}>
        <a.div
          className="scroll-container pointer-events-auto mx-auto mt-5"
          onClick={() => {
            window.scrollTo({ top: height - 160, behaviour: 'smooth' })
          }}
          style={{ opacity: offset.to((o) => (o > height / 3 ? 0 : 1)) }}
        >
          <div className="scroller"></div>
        </a.div>
      </div>
      <Container className="Home page">
        <Row
          style={{
            minHeight: isMobile ? height * 0.6 : height * 0.6,
            marginBottom: isMobile ? height * 0.28 : height * 0.25,
          }}
          className="align-items-center align-items-md-start"
        >
          {isMobile ? null : (
            <Col sm={{ span: 3 }}>
              <Logo
                className="position-absolute"
                width={250}
                height={350}
                style={{ top: -50, color: 'var(--bs-secondary)' }}
              />
            </Col>
          )}
          <Col>
            <a.div
              className="w-100 Home_animatedWordWrapper"
              style={{
                transform: offset.to((o) => `translateY(${isMobile ? o * 0.5 : o * 0.35}px)`),
                opacity: offset.to((o) => (o > height * 0.7 ? 0 : 1)),
              }}
            >
              {animatedWords.map((w, i) => (
                <a.h2
                  className={`Home_animatedWord outlined display-2 d-inline-block m-0 pointer-events-auto ${
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
            <Container fluid className="p-0 mb-5 mb-md-0 pointer-events-auto">
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
                        <button className="btn btn-white btn-lg">
                          <span className="me-2">{t('allAvailableStories')} </span>
                          <ArrowRightCircle size={28} />
                        </button>
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
        className="w-100 pointer-events-none"
        style={{
          minHeight: height,
          transform: offset.to((o) => `translateY(${o * biographiesSpringSpeed}px)`),
        }}
      >
        <HomeBiographies
          className="pointer-events-auto"
          isMobile={isMobile}
          speed={biographiesSpringSpeed}
          availableWidth={width}
          availableHeight={isMobile ? height / 1.5 : height / 2}
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