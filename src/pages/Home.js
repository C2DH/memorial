import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useCurrentWindowDimensions } from '../hooks'
import StoriesReel from '../components/StoriesReel'
import Landscape from '../components/Landscape'

const Home = () => {
  const { t } = useTranslation()
  const { width, height } = useCurrentWindowDimensions()
  // load people
  return (
    <div className="Home mt-5" >
    <Container style={{minHeight: height - 10}}>
      <Row className="my-5">
        <Col>
          <h1>{t('pagesHomeTitle')}</h1>
        </Col>
        <Col>
          <h2 className="mb-5">{t('pagesHomeSubheading')}</h2>
          <section dangerouslySetInnerHTML={{__html: t('pagesHomeIntroduction')}} />
        </Col>
      </Row>
    </Container>
    <Landscape height={height - 10} width={width}
      className="position-absolute top-0"
      style={{ zIndex: -1 }}
    />
    <StoriesReel height={height}/>
    <Container>
      <h3>Lorem ipsum dolor sit amet</h3>

      <Row>
        <Col>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </Col>
        <Col>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default Home
