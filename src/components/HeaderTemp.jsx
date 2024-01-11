import React from 'react'
import { useTranslation } from 'react-i18next'
import LangLink from './LangLink'
import Logo from './Logo'
import { AboutRoute, BiographiesRoute, HomeRoute, FaqRoute } from '../constants'
import { useStore } from '../store'
import LanguageSwitch from './LanguageSwitch'
import './headerTemp.css'

const HeaderTemp = () => {
  const { t } = useTranslation()
  const routeLabel = useStore((state) => state.routeLabel)

  return (
    <header className="header-temp">
      <nav role="navigation" aria-label={t('ariaLabelSearch')}>
        {routeLabel !== HomeRoute.label ? (
          <LangLink to={HomeRoute.to}>
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
        <LangLink to={HomeRoute.to}>{t(HomeRoute.label)}</LangLink>
      </nav>
      <nav role="navigation" aria-label={t('ariaLabelLanguageAbout')}>
        <LangLink to={BiographiesRoute.to}>{t(BiographiesRoute.label)}</LangLink>
        <LangLink to={AboutRoute.to}>{t(AboutRoute.label)}</LangLink>
        <LangLink to={FaqRoute.to}>{t(FaqRoute.label)}</LangLink>
        <LanguageSwitch />
      </nav>
    </header>
  )
}

export default HeaderTemp
