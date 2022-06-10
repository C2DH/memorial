import React, { useEffect, useState } from 'react'
import { useLocation, matchPath } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  LanguagePathRegExp,
  LanguageRootPathRegExp,
  HomeRoute,
  AllRoutes
} from '../constants'
import LangLink from './LangLink'


const Breadcrumb = () => {
  const {pathname} = useLocation()
  const { t } = useTranslation()
  const [routes, set]= useState([ HomeRoute ])

  useEffect(()=> {
    console.debug('[Breadcrumb] @useEffect pathname:', pathname)
    // remove initial language
    const isRootPath = pathname.match(LanguageRootPathRegExp)
    if (!isRootPath) {
      const path = pathname.replace(LanguagePathRegExp, '/')
      const chunks = [ ]
      console.debug(' - path:', path)
      const matchingRoute = AllRoutes.find((d) => {
        const match = matchPath({ path: d.to }, path)
        return match !== null
      })
      if (matchingRoute) {
        if (matchingRoute.parentRoute ) {
          chunks.push(matchingRoute.parentRoute)
          console.debug(' - chunk:', matchingRoute.parentRoute.to)
        }
        chunks.push(matchingRoute)
        console.debug(' - chunk:', matchingRoute.to)
        set([ HomeRoute ].concat(chunks))
      } else {
        console.debug(' - NO MATCHING ROUTE!')
      }
    }
  }, [ pathname ])
  return (
    <ol className="Breadcrumb breadcrumb m-0">
      {routes.map((route, i) => {
        if (i < routes.length - 1) {
          return (
            <li key={i} className='breadcrumb-item'>
              <LangLink to={route.to}>{t(route.label)}</LangLink>
            </li>
          )
        }
        return (
          <li key={i} className='breadcrumb-item active'>
            <b>{t(route.label)}</b>
          </li>
        )
      })}
    </ol>
  )
}

export default Breadcrumb
