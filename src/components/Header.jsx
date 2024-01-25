import React from 'react'
import { useTranslation } from 'react-i18next'
import LangLink from './LangLink'
import {
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
import { isMobile } from 'react-device-detect'
import { LogoMemorial } from './Hero/ui/Logo'
import LogoMemorialCompact from './LogoMemorialCompact'

const Header = () => {
  const { t } = useTranslation()
  const routeLabel = useStore((state) => state.routeLabel)

  // const activeLanguage = window.location.pathname.match(LanguagePathRegExp)
  const isRootPath = window.location.pathname.match(LanguageRootPathRegExp)
  console.debug('[Header] isRootPath:', isRootPath, '\n - routeLabel:', routeLabel)
  return (
    <>
      {!isMobile && routeLabel === HomeRoute.label ? (
        <div className="overlay__logo">
          <LogoMemorial width={180} />
        </div>
      ) : null}
      <header className="Header">
        <div className="container p-0 d-flex justify-content-between">
          <div className="home-nav-wrapper">
            {routeLabel !== HomeRoute.label ? (
              <>
                <LogoMemorialCompact
                  width={100}
                  className="me-3 position-absolute"
                  color="var(--bs-primary-text)"
                />
              </>
            ) : null}
            <div
              style={{ paddingLeft: '8rem' }}
              className={routeLabel === HomeRoute.label ? 'active' : null}
            >
              <LangLink to={HomeRoute.to} className="">
                {t(HomeRoute.label)}
              </LangLink>
            </div>
          </div>

          <nav className="Header_Nav" role="navigation" aria-label={t('ariaLabelLanguageAbout')}>
            <ul className="d-flex justify-content-end">
              <li
                className={
                  [BiographiesRoute.label, StoryRoute.label].includes(routeLabel) ? 'active' : null
                }
              >
                <LangLink to={BiographiesRoute.to}>{t(BiographiesRoute.label)}</LangLink>
              </li>
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
              <li className="pe-2">
                <LanguageSwitch isRootPath={isRootPath} className="d-flex" linkClassName="ms-3" />
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header
