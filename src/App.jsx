import { Suspense, lazy } from 'react'
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
import PrefetchAuthors from './components/PrefetchAuthors'

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
          <Suspense fallback={null}>
            <MobileHeader />{' '}
          </Suspense>
        ) : (
          <Suspense fallback={null}>
            <Header />
          </Suspense>
        )}
        <LanguageRouter />
        <MatomoTracker />
        <ScrollToTop />
        <WithMiller>
          <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <PrefetchAuthors />
            <Routes>
              <Route path="/" element={<Navigate to={languageCode} replace />} />
              <Route path={languageCode}>
                <Route
                  path=""
                  element={
                    <Suspense fallback={<div className="h-75" />}>
                      <Home isMobile={isMobile} />
                    </Suspense>
                  }
                />

                <Route
                  path="people"
                  element={
                    <Suspense fallback={<>...</>}>
                      <People isMobile={isMobile} />
                    </Suspense>
                  }
                ></Route>
                <Route
                  path="story/:storyId"
                  element={
                    <Suspense fallback={<>...</>}>
                      <Story />
                    </Suspense>
                  }
                />
                <Route
                  path="convoy/:storyId"
                  element={
                    <Suspense fallback={<>...</>}>
                      <Convoy />
                    </Suspense>
                  }
                />
                <Route
                  path="biographies"
                  element={
                    <Suspense fallback={<>...</>}>
                      <Biographies />
                    </Suspense>
                  }
                />
                <Route
                  path="author/:authorId"
                  element={
                    <Suspense fallback={<>...</>}>
                      <Biographies />
                    </Suspense>
                  }
                />
                <Route
                  path="doc/:docId"
                  element={
                    <Suspense fallback={<>...</>}>
                      <Document />
                    </Suspense>
                  }
                />
                <Route
                  path="person/:personId"
                  element={
                    <Suspense fallback={<>...</>}>
                      <Person />
                    </Suspense>
                  }
                />
                <Route
                  path="pages/:pageId"
                  element={
                    <Suspense fallback={<>...</>}>
                      <Page>
                        {({ pageId }) =>
                          pageId === 'terms-of-use' ? (
                            <TermsOfUseCookies defaultAcceptCookies={AcceptCookies} />
                          ) : null
                        }
                      </Page>
                    </Suspense>
                  }
                />
                <Route
                  path="pages/:pageId"
                  element={
                    <Suspense fallback={<>...</>}>
                      <Page />
                    </Suspense>
                  }
                />
                <Route
                  path="search"
                  element={
                    <Suspense fallback={<>...</>}>
                      <Search />
                    </Suspense>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<>...</>}>
                      <NotFound />
                    </Suspense>
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
