import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import {
  BootstrapStartColumnLayoutNoOffset,
  BootstrapEndColumnLayout,
  DefaultLanguageCode,
  Languages,
  LanguageCodes
} from '../constants'
const LanguagePathRegExp = new RegExp(`\/(${LanguageCodes.join('|')})\/`)


const Header = () => {
  const { t } = useTranslation()

  const activeLanguage = location.pathname.match(LanguagePathRegExp)
  const activeLanguageCode = activeLanguage
    ? activeLanguage[1]
    : DefaultLanguageCode

  return (
    <header className="Header">
      <Container>
        <Row>
          <Col md={{span:1}}>
            Logo
          </Col>
          <Col {...BootstrapStartColumnLayoutNoOffset}>
            <div className="d-flex mt-3 justify-content-between">
              <div >
                Breadcrumb ...
              </div>
              <div>
              Search
              </div>
            </div>
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <div className="d-flex mt-3 justify-content-between">
              <div>
                About
              </div>
              <div>
                {LanguageCodes.map((d, i) => {
                  const href = location.pathname.replace(LanguagePathRegExp, '/' + d + '/')
                  const isActive = d === activeLanguageCode
                  if(isActive) {
                    return <b className="ms-3 active" key={d}>{t('language' + d.toUpperCase())}</b>
                  }
                  return (<a className="ms-3" key={d} href={href}>{t('language' + d.toUpperCase())}</a>)
                })}
              </div>
            </div>
          </Col>
        </Row>

      </Container>
    </header>
  )
}

export default Header
