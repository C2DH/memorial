import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useCurrentWindowDimensions } from '../hooks'


const Home = () => {
  const { t } = useTranslation()
  const { height } = useCurrentWindowDimensions()

  return (
    <div className="Home">
    <Container fluid style={{height}}>
      <Row>
        <Col>
          <h1 className="my-5">{t('pagesHomeTitle')}</h1>
          <p>{t('pagesHomeSubheading')} {t('asNumber', {n: 15040.32456})}</p>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default Home
