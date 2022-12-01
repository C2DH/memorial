import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create((set) => ({
  routeLabel: '',
  setRouteLabel: (routeLabel) => set({ routeLabel }),
  selectedPebble: null,
  setSelectedPebble: (selectedPebble) => set({ selectedPebble }),
}))

export const usePermanentStore = create(
  persist(
    (set) => ({
      acceptAnalyticsCookies: true,
      acceptCookies: false,
      // essential cookies should be accepted, session is stored locally
      setAcceptCookies: () => set({ acceptCookies: true }),
      setAcceptAnalyticsCookies: (value) => set({ acceptAnalyticsCookies: Boolean(value) }),
    }),
    { name: process.env.REACT_APP_LOCALSTORAGE_NAME },
  ),
)
