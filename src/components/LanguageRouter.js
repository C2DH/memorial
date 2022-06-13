import { useEffect } from 'react'
import { useLocation, matchPath } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import {
  LanguageRootPathRegExp,
  LanguagePathRegExp,
  HomeRoute,
  NotFoundRoute,
  AllRoutes
} from '../constants'

const LanguageRouter = () => {
  const {pathname} = useLocation()
  const { i18n } = useTranslation()
  const setRouteLabel = useStore(state => state.setRouteLabel)
  const languageCode = i18n.language.split('-').shift()

  useEffect(() => {
    // check if language has changed and
    // change language code on route change if needed.
    const isRootPath = pathname.match(LanguageRootPathRegExp)
    let routeLabel = HomeRoute.label
    if (!isRootPath) {
      const path = pathname.replace(LanguagePathRegExp, '/')
      const matchingRoute = AllRoutes.find((d) => {
        const match = matchPath({ path: d.to }, path)
        return match !== null
      })
      if (matchingRoute) {
        routeLabel = matchingRoute.label
      } else {
        routeLabel = NotFoundRoute.label
      }
    }
    setRouteLabel(routeLabel)
    console.debug(
      '[LanguageRouter] @useEffect ',
      '\n - pathname:', pathname,
      '\n - languageCode:',  languageCode,
      '\n - routeLabel:', routeLabel
    )
  }, [pathname, languageCode])

  return null
}

export default LanguageRouter
