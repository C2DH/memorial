import { useStore } from '../store'
import { createInstance } from '@jonkoops/matomo-tracker-react'
// Getting non-reactive fresh state on demand
let persistentState = useStore.getState()
try {
  const localStorageState = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALSTORAGE_NAME))
  if (localStorageState) {
    persistentState = localStorageState
  }
} catch (e) {
  console.warn(e)
}
export const AcceptAnalyticsCookies = Boolean(persistentState.state?.acceptAnalyticsCookies)
export const AcceptCookies = Boolean(persistentState.state?.acceptCookies)

console.info(
  AcceptAnalyticsCookies ? '%cMatomo enabled' : '%cMatomo disabled',
  'font-weight: bold',
  import.meta.env.VITE_MATOMO_URLBASE,
)

export const matomo = createInstance({
  urlBase: import.meta.env.VITE_MATOMO_URLBASE,
  siteId: import.meta.env.VITE_MATOMO_SITEID,
  // userId: 'UIDC2DH', // optional, default value: `undefined`.
  // trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
  // srcUrl: 'https://LINK.TO.DOMAIN/tracking.js', // optional, default value: `${urlBase}matomo.js`
  disabled: !AcceptAnalyticsCookies, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: {
    // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10, // optional, default value: `15
  },
  // linkTracking: false, // optional, default value: true
  configurations: {
    // optional, default value: {}
    // any valid matomo configuration, all below are optional
    disableCookies: true,
    setSecureCookie: window.location.protocol === 'https:',
    setRequestMethod: 'POST',
  },
})
