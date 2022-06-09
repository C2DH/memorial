import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'


const LanguageRouter = () => {
  const {pathname} = useLocation()
  const { i18n } = useTranslation()
  const languageCode = i18n.language.split('-').shift()

  useEffect(() => {
    // check if language has changed and
    // change language code on route change if needed.
    // useEffect([])
    console.info('[LanguageRouter] pathname changed', pathname, languageCode)
  }, [pathname, languageCode])

  return null
}

export default LanguageRouter
