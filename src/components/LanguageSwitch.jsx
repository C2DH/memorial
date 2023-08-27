import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { LanguagePathRegExp, LanguageRootPathRegExp, LanguageCodes } from '../constants'

const LanguageSwitch = ({ isRootPath, className = '', linkClassName = '', ...rest }) => {
  const { t, i18n } = useTranslation()
  const { pathname, search = '' } = useLocation()
  const activeLanguageCode = i18n.language.split('-').shift().toLowerCase()
  console.debug('[LanguageSwitch] activeLanguageCode:', activeLanguageCode, pathname, search)
  return (
    <ul className={className} {...rest}>
      {LanguageCodes.map((d, i) => {
        const href = isRootPath
          ? window.location.pathname.replace(LanguageRootPathRegExp, '/' + d + '/')
          : pathname.replace(LanguagePathRegExp, '/' + d + '/')

        const isActive = d === activeLanguageCode
        return (
          <li key={d} className={[isActive ? 'active' : '', i === 0 ? 'first' : ''].join(' ')}>
            <a className={linkClassName} key={d} href={href + search}>
              {t('language' + d.toUpperCase())}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default LanguageSwitch
