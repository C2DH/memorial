import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  LanguagePathRegExp,
  LanguageRootPathRegExp,
  LanguageCodes
} from '../constants'


const LanguageSwitch = ({ isRootPath, className, ...rest }) => {
  const { t, i18n } = useTranslation()
  const activeLanguageCode = i18n.language.split('-').shift().toLowerCase()

  return (
    <ul className={className} {...rest}>
      {LanguageCodes.map((d, i) => {
        const href = isRootPath
          ? window.location.pathname.replace(LanguageRootPathRegExp, '/' + d + '/')
          : window.location.pathname.replace(LanguagePathRegExp, '/' + d + '/')

        const isActive = d === activeLanguageCode
        return (
          <li
            key={d} 
            className={[
              isActive ? 'active' : '',
              i === 0 ? 'first': ''
            ].join(' ')
          }>
            <a  key={d} href={href}>
              {t('language' + d.toUpperCase())}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default LanguageSwitch
