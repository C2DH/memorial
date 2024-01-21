import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'

import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import axios from 'axios'
import { usePebblesStore } from './components/Hero/store'

// replace console.* for disable log debug on production
if (
  process.env.NODE_ENV === 'production' &&
  import.meta.env.VITE_BASEURL === window.location.origin
) {
  console.debug = () => {}
}

const now = new Date()
const loadingTime = now - window.memorialShoahInititalTime
console.debug(
  '[index] loading time:',
  loadingTime,
  'ms',
  'delay:',
  Math.max(3600 - loadingTime, 1000),
)

// ensure at least 5000 ms passed since
// the beginning of the loading
// to avoid flickering
// on slow devices
// (e.g. iPhone 6)

axios.get('/api/pebbles/extent').then((response) => {
  console.debug('[index] extent', response.data)
  const root = ReactDOM.createRoot(document.getElementById('root'))
  usePebblesStore.setState({ pebblesExtent: response.data })

  setTimeout(() => {
    clearInterval(window.memorialShoahParagraphLoop)
    document.getElementById('loading').classList.add('hide')
  }, Math.max(3600 - loadingTime, 1000))

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

// add information on version on startup
console.info(
  'version',
  import.meta.env.VITE_GIT_TAG,
  import.meta.env.VITE_GIT_BRANCH,
  `\nhttps://github.com/C2DH/memorial/commit/${import.meta.env.VITE_GIT_REVISION}`,
)
