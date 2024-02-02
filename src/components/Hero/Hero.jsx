// Styles
import './hero.css'
// Libs
import { Canvas } from '@react-three/fiber'
// Components
import { Scene } from './Scene'
import { Camera } from './components/Camera'
import { Overlay } from './ui/Overlay'
import { ModalDetails } from './ui/ModalDetails'
import ModalCreate from './ui/ModalCreateNew'
// eslint-disable-next-line no-unused-vars
import { StatsGl, Stats } from '@react-three/drei'

import { useEffect, useRef } from 'react'
import { usePebblesStore } from './store'
import { StatusSuccess, useGetJSON } from '../../hooks/data'

import { QueryClient, QueryClientProvider } from 'react-query'
import ModalConfirmation from './ui/ModalConfirmation'
import ModalInfo from './ui/ModalInfo'
import DemoEffect from './components/DemoEffect'

const Hero = ({ isMobile }) => {
  const isNotInteractingTimerRef = useRef(null)
  const setPlayDemo = usePebblesStore((state) => state.setPlayDemo)
  const { data, status, error } = useGetJSON({
    url: '/api/story',
    params: {
      limit: 200,
      exclude: {
        tags__slug__in: ['static', 'convoy'],
      },
    },
  })

  useEffect(() => {
    if (status !== StatusSuccess) return
    if (usePebblesStore.getState().pebblesData.length > 0) {
      setPlayDemo(true)
    } else {
      usePebblesStore.getState().setInitialData()
    }
  }, [status])

  if (error) {
    console.error('[Hero] useGetJSON', error)
  }
  const onMouseMove = (e) => {
    isNotInteractingTimerRef.current && clearTimeout(isNotInteractingTimerRef.current)
    setPlayDemo(false)
    isNotInteractingTimerRef.current = setTimeout(() => {
      setPlayDemo(true)
    }, 100)
  }

  const queryClient = new QueryClient()
  const cameraLeapHandle = (e, z1, z2) => {
    console.debug('[Hero] Camera@LeapHandle placeholder Z range:', z1, z2)
    // @todo this should update the list of the pebbles based on their Z value
  }

  useEffect(() => {
    return () => {
      clearTimeout(isNotInteractingTimerRef.current)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="hero" onMouseMove={onMouseMove}>
        <div
          className="hero__canvas-wrapper"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', duration: 2.0, delay: 0.2 }}
        >
          <Canvas gl={{ alpha: true, antialias: false, shadows: false }} dpr={2}>
            {/* <StatsGl /> */}
            {/* <Stats showPanel={0} /> */}
            <Camera onLeap={cameraLeapHandle} />
            <Scene />
          </Canvas>
        </div>
        <Overlay isMobile={isMobile} />
        <DemoEffect />
        <div className="hero__modals">
          <ModalInfo />
          <ModalConfirmation disableEmail />
          <ModalDetails stories={data?.results} />
          <ModalCreate withCarousel />
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default Hero
