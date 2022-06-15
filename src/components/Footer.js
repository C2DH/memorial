import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import LangLink from './LangLink'
import {
  BootstrapStartColumnLayout,
  BootstrapEndColumnLayout,
  AboutRoute,
  TermsOfUseRoute
} from '../constants'
import { useStore } from '../store'
import '../styles/components/Footer.css'


const Footer = () => {
  const { t } = useTranslation()
  const routeLabel= useStore(state => state.routeLabel)

  return (
    <footer className="py-5 mt-5 Footer">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            Copyright © Université du Luxembourg {(new Date()).getFullYear()}.
            <br/>
            All rights reserved.
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <nav className="Footer_ariaLanguageAbout" aria-label={t('ariaLabelLanguageAbout')}>
              <ul>
              {[AboutRoute, TermsOfUseRoute].map((route) => (
                <li
                  key={route.to}
                  className={ route.label === routeLabel ? 'active'  : null}
                >
                  <LangLink to={route.to}>
                    {t(route.label)}
                  </LangLink>
                </li>
              ))}
              </ul>
            </nav>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
