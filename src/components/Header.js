import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import Breadcrumb from './Breadcrumb'
import {
  BootstrapStartColumnLayoutNoOffset,
  BootstrapEndColumnLayout,
  DefaultLanguageCode,
  Languages,
  LanguageCodes,
  LanguagePathRegExp,
  LanguageRootPathRegExp
} from '../constants'
import '../styles/components/Header.css'


const Header = () => {
  const { t } = useTranslation()

  const activeLanguage = window.location.pathname.match(LanguagePathRegExp)
  const activeLanguageCode = activeLanguage
    ? activeLanguage[1]
    : DefaultLanguageCode

  const isRootPath = window.location.pathname.match(LanguageRootPathRegExp)

  return (
    <header className="Header">
      <Container>
        <Row>
          <Col md={{span:1}}>
            Logo
          </Col>
          <Col {...BootstrapStartColumnLayoutNoOffset}>
            <nav className="Header_ariaSearch" role="navigation" aria-label={t('ariaLabelSearch')} >
              <ul  className="d-flex justify-content-between">
                <li>
                  <Breadcrumb />
                </li>
                <li>
                Search
                </li>
              </ul>
            </nav>
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <nav className="Header_ariaLanguageAbout" role="navigation" aria-label={t('ariaLabelLanguageAbout')} >
              <ul className="d-flex justify-content-between">
                <li>
                  About
                </li>
                <li>
                  <ul className="d-flex">
                  {LanguageCodes.map((d, i) => {
                    const href = isRootPath
                      ? window.location.pathname.replace(LanguageRootPathRegExp, '/' + d + '/')
                      : window.location.pathname.replace(LanguagePathRegExp, '/' + d + '/')

                    const isActive = d === activeLanguageCode
                    if(isActive) {
                      return (
                        <li key={d}>
                          <b className="ms-3 active" key={d}>
                            {t('language' + d.toUpperCase())}
                          </b>
                        </li>
                      )
                    }
                    return (
                      <li key={d}>
                        <a className="ms-3" key={d} href={href}>
                          {t('language' + d.toUpperCase())}
                        </a>
                      </li>
                    )
                  })}
                  </ul>
                </li>
              </ul>
            </nav>
          </Col>
        </Row>

      </Container>
    </header>
  )
}

export default Header
