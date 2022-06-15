import React, { lazy } from 'react'
import { QueryParamProvider } from 'use-query-params'
import { isMobile } from 'react-device-detect'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Footer from './components/Footer'
import LanguageRouter from './components/LanguageRouter'
import RouteAdapter from './components/RouteAdapter'
import { WithMiller } from './logic/miller';
import { initializeI18next } from './logic/language'
const { languageCode } = initializeI18next()
console.info('initial languageCode', languageCode)

const Home = lazy(() => import('./pages/Home'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Story = lazy(() => import('./pages/Story'))
const Search = lazy(() => import('./pages/Search'))
const Page = lazy(() => import('./pages/Page'))

const Header = lazy(() => import('./components/Header'))
const MobileHeader = lazy(() => import('./components/MobileHeader'))

const App = () => {
  console.debug('[App] rendered')
  return (
    <BrowserRouter>
      {isMobile
        ? <React.Suspense fallback={null}><MobileHeader /> </React.Suspense>
        : <React.Suspense fallback={null}><Header /></React.Suspense>
      }
      <LanguageRouter />
      <WithMiller>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={languageCode} replace />}
          />
          <Route path={languageCode}>
            <Route
              path=""
              element={
                <React.Suspense fallback={<div className="h-75" />}>
                  <Home />
                </React.Suspense>
              }
            />
            <Route
              path="story/:storyId"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Story />
                </React.Suspense>
              }
            />
            <Route
              path="pages/:pageId"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Page />
                </React.Suspense>
              }
            />
            <Route
              path="search/:what"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Search />
                </React.Suspense>
              }
            />
            <Route
              path="*"
              element={
                <React.Suspense fallback={<>...</>}>
                  <NotFound/>
                </React.Suspense>
              }
            />
          </Route>
        </Routes>
        </QueryParamProvider>
      </WithMiller>
      <Footer />
    </BrowserRouter>
  )
}

export default App;
