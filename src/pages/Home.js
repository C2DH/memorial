import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import {
  BootstrapStartColumnLayout,
  BootstrapEndColumnLayout,
  BootstrapColumnLayout
} from '../constants'
import '../styles/pages/Home.css'


const Home = () => {
  const { t } = useTranslation()
  return (
    <>
    <div className="position-fixed top-0 left-0 w-100 h-100" style={{
      opacity: .55,
      zIndex: -1,
      backgroundImage: "url('https://miro.medium.com/max/3548/1*gKF1YXEbCA2XdBD5me_wrA.png')"
    }}/>
    <Container className="Home page">
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <h2 className="display-2">{t('pagesHomeSubheading')}</h2>
          </Col>
          <Col {...BootstrapEndColumnLayout}>

          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col {...BootstrapColumnLayout}>
            Biographies
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col {...BootstrapColumnLayout}>
            Biographies
          </Col>
        </Row>
      </Container>
    </>
  )
}
export default Home
