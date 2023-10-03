import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

const MatomoTracker = ({ disabled }) => {
  const { trackPageView } = useMatomo()
  const { pathname, search } = useLocation()

  useEffect(() => {
    console.info('[MatomoTracker] disabled:', !!disabled)
  }, [disabled])

  useEffect(() => {
    if (!disabled) {
      const url = [pathname, search].join('')
      console.info('[MatomoTracker] track pageview:', url)
      trackPageView({
        href: url,
      })
    }
     
  }, [disabled, pathname, search])

  return null
}

export default MatomoTracker
