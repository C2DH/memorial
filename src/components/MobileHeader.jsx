import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { a, useSpring } from 'react-spring'
import LanguageSwitch from './LanguageSwitch'
import LangLink from './LangLink'
import {
  HomeRoute,
  AboutRoute,
  TermsOfUseRoute,
  BiographiesRoute,
  PeopleRoute,
  FaqRoute,
} from '../constants'
import { useStore } from '../store'
import { useCurrentWindowDimensions } from '../hooks/viewport'
import '../styles/components/MobileHeader.css'
import { Menu } from 'react-feather'
import LogoMemorialCompact from './LogoMemorialCompact'

const MobileHeader = () => {
  const { width, height } = useCurrentWindowDimensions()
  const { t } = useTranslation()
  const [style, api] = useSpring(() => ({ x: -width }))
  const [isOpen, setIsOpen] = useState(false)
  const routeLabel = useStore((state) => state.routeLabel)

  const onClick = () => {
    if (isOpen) {
      api.start({ x: -width })
    } else {
      api.start({ x: 0 })
    }
    setIsOpen(!isOpen)
  }

  const routeOnClickHandler = () => {
    api.start({ x: -width })
    setIsOpen(false)
  }
  return (
    <>
      <header
        className="MobileHeader position-fixed top-0"
        style={{ zIndex: 1000, cursor: 'pointer', width }}
      >
        <div
          onClick={onClick}
          className="MobileHeader_menubtn position-absolute bg-secondary right-0 top-0"
        >
          <span>{t('Menu')}</span> <Menu size={22} />{' '}
        </div>
        <a.div style={{ width, height, ...style }} className="position-absolute MobileHeader_menu">
          <ul>
            {[HomeRoute, BiographiesRoute, PeopleRoute, AboutRoute, FaqRoute, TermsOfUseRoute].map(
              (route) => (
                <li key={route.to} className={route.label === routeLabel ? 'active' : null}>
                  <LangLink to={route.to} onClick={routeOnClickHandler}>
                    {t(route.label)}
                  </LangLink>
                </li>
              ),
            )}
          </ul>
          <LanguageSwitch className="MobileHeader_menu_LanguageSwitch" />
        </a.div>
      </header>
      <LangLink to={HomeRoute.to} onClick={routeOnClickHandler}>
        <LogoMemorialCompact
          width={120}
          rest={{ position: 'absolute', zIndex: '1', top: '1rem', left: '1rem' }}
        />
      </LangLink>
    </>
  )
}

export default MobileHeader
