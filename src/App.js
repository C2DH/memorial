import React, { useEffect, lazy } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import LanguageRouter from './components/LanguageRouter'
import { initializeI18next } from './logic/language'
const { languageCode } = initializeI18next()
import { WithMiller } from './logic/miller';
console.info('initial languageCode', languageCode)

const Home = lazy(() => import('./pages/Home'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Story = lazy(() => import('./pages/Story'))



const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <LanguageRouter />
      <WithMiller>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={languageCode} replace />}
          />
          <Route path={languageCode}>
            <Route path="" element={<Home />} />
            <Route path="story/:storyId" element={<Story />} />
            <Route path="*" element={<NotFound/>} />
          </Route>
        </Routes>
      </WithMiller>
      <Footer />
    </BrowserRouter>
  )
}

export default App;
