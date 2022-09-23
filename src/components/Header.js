import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import LangLink from './LangLink'
import Logo from './Logo'
import {
  BootstrapStartColumnLayoutNoOffset,
  BootstrapEndColumnLayout,
  DefaultLanguageCode,
  LanguageCodes,
  LanguagePathRegExp,
  LanguageRootPathRegExp,
  AboutRoute,
  StoryRoute,
  BiographiesRoute,
  HomeRoute,
} from '../constants'
import { useStore } from '../store'
import '../styles/components/Header.css'

const Header = () => {
  const { t } = useTranslation()
  const routeLabel = useStore((state) => state.routeLabel)

  const activeLanguage = window.location.pathname.match(LanguagePathRegExp)
  const isRootPath = window.location.pathname.match(LanguageRootPathRegExp)
  const activeLanguageCode = activeLanguage
    ? activeLanguage[1]
    : isRootPath
    ? isRootPath[1]
    : DefaultLanguageCode

  return (
    <header className="Header">
      <Container>
        <Row>
          <Col md={{ span: 1 }} className="position-relative">
            <LangLink to={HomeRoute.to} className="">
              <Logo
                width={80}
                height={80}
                style={{
                  top: '50%',
                  marginTop: -40,
                }}
                color="var(--bs-primary-text)"
                className="position-absolute"
              />
            </LangLink>
          </Col>
          <Col {...BootstrapStartColumnLayoutNoOffset}>
            <nav className="Header_ariaSearch" role="navigation" aria-label={t('ariaLabelSearch')}>
              <ul className="d-flex justify-content-between">
                <li className={routeLabel === HomeRoute.label ? 'active' : null}>
                  <LangLink to={HomeRoute.to} className="">
                    {t(HomeRoute.label)}
                  </LangLink>
                </li>
                {/* <li>
                  <Breadcrumb />
                </li> */}
                {/* <li
                  className={
                    [SearchRoute.label, SearchStoryRoute.label].includes(routeLabel)
                      ? 'active'
                      : null
                  }
                >
                  <LangLink to={SearchRoute.to}>{t(SearchRoute.label)}</LangLink>
                </li> */}
                <li
                  className={
                    [BiographiesRoute.label, StoryRoute.label].includes(routeLabel)
                      ? 'active'
                      : null
                  }
                  style={{ borderRight: '1px solid', paddingRight: '1.75rem' }}
                >
                  <LangLink to={BiographiesRoute.to} className="">
                    {t(BiographiesRoute.label)}
                  </LangLink>
                </li>
              </ul>
            </nav>
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <nav
              className="Header_ariaLanguageAbout"
              role="navigation"
              aria-label={t('ariaLabelLanguageAbout')}
            >
              <ul className="d-flex justify-content-between">
                <li className={routeLabel === AboutRoute.label ? 'active' : null}>
                  <LangLink to={AboutRoute.to} className="">
                    {t(AboutRoute.label)}
                  </LangLink>
                </li>
                <li>
                  <ul className="d-flex">
                    {LanguageCodes.map((d) => {
                      const href = isRootPath
                        ? window.location.pathname.replace(LanguageRootPathRegExp, '/' + d + '/')
                        : window.location.pathname.replace(LanguagePathRegExp, '/' + d + '/')

                      const isActive = d === activeLanguageCode
                      return (
                        <li key={d} className={isActive ? 'active' : null}>
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
