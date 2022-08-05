import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSprings, a } from 'react-spring'
import { Container, Row, Col } from 'react-bootstrap'
import LangLink from '../components/LangLink'
import TopStories from '../components/TopStories'
import TopDocuments from '../components/TopDocuments'
import {
  BootstrapStartColumnLayout,
  BootstrapEndColumnLayout,
  BootstrapColumnLayout,
} from '../constants'
import '../styles/pages/Home.css'

const to = (i) => ({
  opacity: 1,

  delay: i * 500 + Math.random() * 4500,
})
const from = () => ({ opacity: 0.12 })

const Home = () => {
  const { t } = useTranslation()
  const words = String(t('pagesHomeSubheading')).split(' ')
  const [animatedWords] = useSprings(words.length, (i) => ({
    config: {
      duration: 2000,
    },
    loop: { reverse: true },
    ...to(i),
    from: from(),
  }))
  //
  // React.useLayoutEffect(() => {
  //   const t = setTimeout(() => {
  //     api.start(i => to(i))
  //   }, 10000)
  //   return function cleanup() {
  //     clearTimeout(t)
  //   }
  // }, [])

  return (
    <>
      <div
        className="d-none position-fixed top-0 left-0 w-100 h-100"
        style={{
          opacity: 0.55,
          zIndex: -1,
          backgroundImage: "url('https://miro.medium.com/max/3548/1*gKF1YXEbCA2XdBD5me_wrA.png')",
        }}
      />
      <Container className="Home page">
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <div className="w-100">
              {animatedWords.map((w, i) => (
                <a.h2
                  className={`display-2 d-inline-block m-0 ${i === 0 ? 'first' : ''} `}
                  style={w}
                  key={i}
                >
                  {words[i]}&nbsp;
                </a.h2>
              ))}
            </div>
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <TopStories
              params={{
                exclude: { tags__name: 'static' },
              }}
            >
              <section className="mb-3">
                <p dangerouslySetInnerHTML={{ __html: t('topStoriesIntro') }} />
                <LangLink to="/search/stories">{t('AllStories')}</LangLink>
              </section>
            </TopStories>

            <TopDocuments
              params={{
                filters: { data__type: 'person' },
                limit: 3,
              }}
              label={t('people')}
            />
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col {...BootstrapColumnLayout}>Biographies</Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col {...BootstrapColumnLayout}>Biographies</Col>
        </Row>
      </Container>
    </>
  )
}
export default Home
