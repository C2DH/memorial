import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {
  BootstrapStartColumnLayout,
  BootstrapEndColumnLayout
} from '../constants'

const Home = () => {
  return (
    <>
    <div className="position-fixed top-0 left-0 w-100 h-100" style={{
      opacity: .7,
      zIndex: -1,
      backgroundImage: "url('https://miro.medium.com/max/3548/1*gKF1YXEbCA2XdBD5me_wrA.png')"
    }}/>
    <Container className="Home page h-75">
        <Row>
          <Col {...BootstrapStartColumnLayout}>

          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <h2>
            This memorial is bridging stories and memories of
            victims and survivors of the Shoah.
            </h2>
          </Col>
        </Row>
      </Container>
      <Container className="h-75 border-top border-dark">
        blabla
      </Container>
    </>
  )
}
export default Home
