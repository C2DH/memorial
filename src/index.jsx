import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'

import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

// replace console.* for disable log debug on production
if (
  process.env.NODE_ENV === 'production' &&
  import.meta.env.VITE_BASEURL === window.location.origin
) {
  console.debug = () => {}
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

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
