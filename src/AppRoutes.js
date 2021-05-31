import React, { Suspense, lazy, useEffect } from 'react'
import { Switch, Route, Redirect, useRouteMatch, useLocation } from "react-router-dom"
import ReactGA from 'react-ga'
import { QueryParamProvider } from 'use-query-params'
import AppRouteLoading from './pages/AppRouteLoading'
import { LanguageRoutePattern } from './constants'

/* Pages */
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Story = lazy(() => import('./pages/Story'))
const Person = lazy(() => import('./pages/Person'))
const Search = lazy(() => import('./pages/Search'))

/* Pages routing by language */
const LangRoutes = () => {
  const { path } = useRouteMatch()
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Home />
      </Route>
      <Route exact path={`${path}/about`}>
        <About />
      </Route>
      <Route exact path={`${path}/terms-of-use`}>
        <TermsOfUse />
      </Route>
      <Route exact path={`${path}/story/:slug`}>
        <Story />
      </Route>
      <Route exact path={`${path}/person/:slug`}>
        <Person />
      </Route>
      <Route exact path={`${path}/search`}>
        <Search />
      </Route>
      <Route path={`${path}*`}>
        <NotFound />
      </Route>
    </Switch>
  )
}

const usePageViews = ({ enableGA }) => {
  let location = useLocation()

  useEffect(
    () => {
      const url = [location.pathname, location.search].join('')
      if (enableGA) {
        console.info('ReactGA.pageview:', url)
        ReactGA.pageview(url)
      } else {
        console.info('ReactGA.pageview disabled:', url)
      }
    },
    [location, enableGA]
  )
}

const AppRoutes = ({enableGA=false, startLanguageCode='en'}) => {
  usePageViews({ enableGA })

  return (
    <Suspense fallback={<AppRouteLoading/>}>
      <QueryParamProvider ReactRouterRoute={Route}>
        <Switch>
          <Redirect from="/" exact to={startLanguageCode} />
          <Route path={LanguageRoutePattern}>
            <LangRoutes />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </QueryParamProvider>
    </Suspense>
  )
}

export default AppRoutes
