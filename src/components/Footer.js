import React from 'react'
import { isMobile } from 'react-device-detect'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import LangLink from './LangLink'
import LanguageSwitch from './LanguageSwitch'
import LogoC2dhUnilu from './LogoC2dhUnilu'
import {
  BootstrapColumnLayout,
  BootstrapStartColumnLayout,
  BootstrapEndColumnLayout,
  HomeRoute,
  AboutRoute,
  TermsOfUseRoute,
  BiographiesRoute,
} from '../constants'
import LogoFondLuxShoah from '../assets/images/fondluxshoah-logo.png'
import { useStore } from '../store'
import '../styles/components/Footer.css'

const Footer = () => {
  const { t } = useTranslation()
  const routeLabel = useStore((state) => state.routeLabel)

  return (
    <footer className="py-5 mt-5 Footer">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout} className="order-1 mt-5 mt-md-0">
            Copyright ©{' '}
            <a href="https://uni.lu" target="_blank" rel="noreferrer">
              Université du Luxembourg
            </a>{' '}
            {new Date().getFullYear()}.
            <br />
            All rights reserved.
          </Col>
          <Col {...BootstrapEndColumnLayout} className="order-md-1">
            <nav
              className="Footer_ariaLanguageAbout mt-5 mt-md-0"
              aria-label={t('ariaLabelLanguageAbout')}
            >
              <ul>
                {[HomeRoute, BiographiesRoute, AboutRoute, TermsOfUseRoute].map((route) => (
                  <li key={route.to} className={route.label === routeLabel ? 'active' : null}>
                    <LangLink to={route.to}>{t(route.label)}</LangLink>
                  </li>
                ))}
              </ul>

              {isMobile && (
                <LanguageSwitch
                  className="Footer_LanguageSwitch d-flex p-0 m-0"
                  isRootPath={routeLabel === HomeRoute.label}
                />
              )}
            </nav>
          </Col>
        </Row>
        <Row>
          <Col {...BootstrapColumnLayout} className="d-flex">
            <LogoC2dhUnilu style={{ marginLeft: -23 }} color="var(--bs-dark)" height={70} />
            <a
              href="https://fondluxshoah.lu/"
              target="_blank"
              title="Fondation luxembourgeoise pour la Mémoire de la Shoah"
              rel="noreferrer"
              className="ms-3"
            >
              <img
                src={LogoFondLuxShoah}
                style={{ height: 75 }}
                alt="Logo Fondation luxembourgeoise pour la Mémoire de la Shoah"
              />
            </a>
          </Col>
          <Col />
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
