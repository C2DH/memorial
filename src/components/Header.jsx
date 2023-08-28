import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import LangLink from './LangLink'
import Logo from './Logo'
import {
  BootstrapStartColumnLayoutNoOffset,
  BootstrapEndColumnLayout,
  LanguageRootPathRegExp,
  AboutRoute,
  StoryRoute,
  BiographiesRoute,
  HomeRoute,
  // PeopleRoute,
  FaqRoute,
} from '../constants'
import { useStore } from '../store'
import '../styles/components/Header.css'
import LanguageSwitch from './LanguageSwitch'

const Header = () => {
  const { t } = useTranslation()
  const routeLabel = useStore((state) => state.routeLabel)

  // const activeLanguage = window.location.pathname.match(LanguagePathRegExp)
  const isRootPath = window.location.pathname.match(LanguageRootPathRegExp)

  return (
    <header className="Header">
      <Container>
        <Row>
          <Col md={{ span: 1 }} className="position-relative">
            {routeLabel !== HomeRoute.label ? (
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
            ) : null}
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
                <li>
                  <ul className="d-flex">
                    <li
                      className={
                        [BiographiesRoute.label, StoryRoute.label].includes(routeLabel)
                          ? 'active'
                          : null
                      }
                    >
                      <LangLink to={BiographiesRoute.to}>{t(BiographiesRoute.label)}</LangLink>
                    </li>
                    {/* <li
                      style={{ borderRight: '1px solid', paddingRight: '1.75rem' }}
                      className={routeLabel === PeopleRoute.label ? 'active' : null}
                    >
                      <LangLink to={PeopleRoute.to} className="ms-4">
                        {t(PeopleRoute.label)}
                      </LangLink>
                    </li> */}
                  </ul>
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
                <li className={routeLabel === FaqRoute.label ? 'active' : null}>
                  <LangLink to={FaqRoute.to} className="">
                    {t(FaqRoute.label)}
                  </LangLink>
                </li>

                <li>
                  <LanguageSwitch isRootPath={isRootPath} className="d-flex" linkClassName="ms-3" />
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
