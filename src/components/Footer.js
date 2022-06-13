import { Container, Row, Col } from 'react-bootstrap'
import LangLink from './LangLink'
import {
  BootstrapStartColumnLayout,
  BootstrapEndColumnLayout,
  AboutRoute,
  TermsOfUseRoute
} from '../constants'

const Footer = () => {
  return (
    <footer className="py-5 mt-5 bg-primary">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            Copyright © Université du Luxembourg {(new Date()).getFullYear()}.
            <br/>
            All rights reserved.
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            {[AboutRoute, TermsOfUseRoute].map((route) => (
              <LangLink key={route.to}>
                {route.label}
              </LangLink>
            ))}
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
