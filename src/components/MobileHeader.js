import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { a, useSpring } from 'react-spring'
import LanguageSwitch from './LanguageSwitch'
import LangLink from './LangLink'
import Logo from './Logo'
import { HomeRoute, SearchStoryRoute, AboutRoute, TermsOfUseRoute } from '../constants'
import { useStore } from '../store'
import { useCurrentWindowDimensions } from '../hooks/viewport'
import '../styles/components/MobileHeader.css'
import { Menu } from 'react-feather'

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
  return (
    <>
      <header
        className="MobileHeader position-fixed top-0 w-100"
        onClick={onClick}
        style={{ zIndex: 1000, cursor: 'pointer' }}
      >
        <div className="MobileHeader_menubtn position-absolute bg-secondary right-0 top-0">
          <span>{t('Menu')}</span> <Menu size={22} />{' '}
        </div>
        <a.div style={{ width, height, ...style }} className="position-absolute MobileHeader_menu">
          <ul>
            {[HomeRoute, SearchStoryRoute, AboutRoute, TermsOfUseRoute].map((route) => (
              <li key={route.to} className={route.label === routeLabel ? 'active' : null}>
                <LangLink to={route.to}>{t(route.label)}</LangLink>
              </li>
            ))}
          </ul>
          <LanguageSwitch className="MobileHeader_menu_LanguageSwitch" />
        </a.div>
      </header>
      <Logo
        style={{ color: 'white', zIndex: 1001, top: -20, left: -15 }}
        height={155}
        width={155}
        className="MobileHeader_Logo position-absolute mx-2 mt-1"
      />
    </>
  )
}

export default MobileHeader
