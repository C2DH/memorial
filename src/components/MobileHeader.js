import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { a, useSpring } from 'react-spring'
import LanguageSwitch from './LanguageSwitch'
import LangLink from './LangLink'
import Logo from './Logo'
import {
  HomeRoute, SearchStoryRoute, AboutRoute, TermsOfUseRoute
} from '../constants'
import { useStore } from '../store'
import { useCurrentWindowDimensions } from '../hooks/viewport'
import '../styles/components/MobileHeader.css'

const MobileHeader = () => {
  const { width } = useCurrentWindowDimensions()
  const { t } = useTranslation()
  const [style, api] = useSpring(() => ({ x: -width }))
  const [isOpen, setIsOpen] = useState(false)
  const routeLabel= useStore(state => state.routeLabel)

  const onClick=() => {
    if (isOpen) {
      api.start({ x:  -width })
    } else {
      api.start({ x: 0 })
    }
    setIsOpen(!isOpen)
  }
  return (
    <header
      className="MobileHeader position-fixed top-0"
      onClick={onClick}
      style={{ zIndex: 1000, cursor: 'pointer' }}
    >
      <Logo
        height={70} width={70}
        className="mx-2 mt-1"
      />
      <a.div style={{ width, ...style}} className="position-absolute MobileHeader_menu">
        <ul>
        {[HomeRoute, SearchStoryRoute, AboutRoute, TermsOfUseRoute].map((route) => (
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
        <LanguageSwitch className="MobileHeader_menu_LanguageSwitch"/>
      </a.div>
    </header>
  )
}

export default MobileHeader
