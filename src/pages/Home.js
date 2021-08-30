import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useCurrentWindowDimensions } from '../hooks'
import StoriesReel from '../components/StoriesReel'


const Home = () => {
  const { t } = useTranslation()
  const { height } = useCurrentWindowDimensions()
  // load people
  return (
    <div className="Home mt-5">
    <Container>
      <Row>
        <Col>
          <h1 className="my-5">{t('pagesHomeTitle')}</h1>
          <p>{t('pagesHomeSubheading')} {t('asNumber', {n: 15040.32456})}</p>
        </Col>

      </Row>
    </Container>
    <StoriesReel height={height}/>
    </div>
  )
}

export default Home
