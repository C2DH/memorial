import React, { lazy } from 'react'
import { QueryParamProvider } from 'use-query-params'
import { isMobile } from 'react-device-detect'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import LanguageRouter from './components/LanguageRouter'
import RouteAdapter from './components/RouteAdapter'
import { WithMiller } from './logic/miller'
import { initializeI18next } from './logic/language'
import { AcceptAnalyticsCookies, AcceptCookies, matomo } from './logic/tracking'
import { MatomoProvider } from '@jonkoops/matomo-tracker-react'
import MatomoTracker from './components/MatomoTracker'
import Cookies from './components/Cookies'
import TermsOfUseCookies from './components/TermsOfuseCookies'

console.info('\n ◊ \n\n')

// console.info('initial saved state', persistentState)
console.info('%cacceptAnalyticsCookies', 'font-weight: bold', AcceptAnalyticsCookies)
console.info('%cacceptCookies', 'font-weight: bold', AcceptCookies)

const { languageCode } = initializeI18next()
console.info('initial languageCode', languageCode)

const Biographies = lazy(() => import('./pages/Biographies'))
const Document = lazy(() => import('./pages/Document'))
const Home = lazy(() => import('./pages/Home'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Page = lazy(() => import('./pages/Page'))
const Person = lazy(() => import('./pages/Person'))
const People = lazy(() => import('./pages/People'))
const Search = lazy(() => import('./pages/Search'))
const Story = lazy(() => import('./pages/Story'))
const Convoy = lazy(() => import('./pages/Convoy'))

const Header = lazy(() => import('./components/Header'))
const MobileHeader = lazy(() => import('./components/MobileHeader'))

const App = () => {
  console.debug('[App] rendered')
  return (
    <MatomoProvider value={matomo}>
      <BrowserRouter>
        {isMobile ? (
          <React.Suspense fallback={null}>
            <MobileHeader />{' '}
          </React.Suspense>
        ) : (
          <React.Suspense fallback={null}>
            <Header />
          </React.Suspense>
        )}
        <LanguageRouter />
        <MatomoTracker />
        <ScrollToTop />
        <WithMiller>
          <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <Routes>
              <Route path="/" element={<Navigate to={languageCode} replace />} />
              <Route path={languageCode}>
                <Route
                  path=""
                  element={
                    <React.Suspense fallback={<div className="h-75" />}>
                      <Home isMobile={isMobile} />
                    </React.Suspense>
                  }
                />

                <Route
                  path="people"
                  element={
                    <React.Suspense fallback={<>...</>}>
                      <People isMobile={isMobile} />
                    </React.Suspense>
                  }
                ></Route>
                <Route
                  path="story/:storyId"
                  element={
                    <React.Suspense fallback={<>...</>}>
                      <Story />
                    </React.Suspense>
                  }
                />
                <Route
                  path="convoy/:storyId"
                  element={
                    <React.Suspense fallback={<>...</>}>
                      <Convoy />
                    </React.Suspense>
                  }
                />
                <Route
                  path="biographies"
                  element={
                    <React.Suspense fallback={<>...</>}>
                      <Biographies />
                    </React.Suspense>
                  }
                />
                <Route
                  path="author/:authorId"
                  element={
                    <React.Suspense fallback={<>...</>}>
                      <Biographies />
                    </React.Suspense>
                  }
                />
                <Route
                  path="doc/:docId"
                  element={
                    <React.Suspense fallback={<>...</>}>
                      <Document />
                    </React.Suspense>
                  }
                />
                <Route
                  path="person/:personId"
                  element={
                    <React.Suspense fallback={<>...</>}>
                      <Person />
                    </React.Suspense>
                  }
                />
                <Route
                  path="pages/:pageId"
                  element={
                    <React.Suspense fallback={<>...</>}>
                      <Page
                        children={({ pageId }) =>
                          pageId === 'terms-of-use' ? (
                            <TermsOfUseCookies defaultAcceptCookies={AcceptCookies} />
                          ) : null
                        }
                      ></Page>
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
                      <NotFound />
                    </React.Suspense>
                  }
                />
              </Route>
            </Routes>
          </QueryParamProvider>
        </WithMiller>
        <Footer isMobile={isMobile} />
        <Cookies defaultAcceptCookies={AcceptCookies} />
      </BrowserRouter>
    </MatomoProvider>
  )
}

export default App