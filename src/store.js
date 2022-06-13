import create from 'zustand'

export const useStore = create(set => ({
  routeLabel: '',
  setRouteLabel: (routeLabel) => set({ routeLabel })
}))
