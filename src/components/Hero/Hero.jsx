// Styles
import './hero.css'
// Libs
import { Canvas } from '@react-three/fiber'
// Components
import { Scene } from './Scene'
import { Camera } from './components/Camera'
import { Overlay } from './ui/Overlay'
import { ModalDetails } from './ui/ModalDetails'
import { ModalCreate } from './ui/ModalCreate'
// eslint-disable-next-line no-unused-vars
import { StatsGl, Stats } from '@react-three/drei'

import { useEffect } from 'react'
import { usePebblesStore } from './store'
import { StatusSuccess, useGetJSON } from '../../hooks/data'

const Hero = ({ isMobile }) => {
  const { data, status, error } = useGetJSON({
    url: 'https://memorialshoah.lu/api/story',
    params: {
      limit: 200,
      exclude: {
        tags__slug__in: ['static', 'convoy'],
      },
    },
  })

  useEffect(() => {
    if (status !== StatusSuccess) return
    if (usePebblesStore.getState().pebblesData.length > 0) return
    usePebblesStore.getState().setInitialData()
  }, [status])
  if (error) {
    console.error('[Hero] useGetJSON', error)
  }
  return (
    <div className="hero">
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
          <Camera />
          <Scene />
        </Canvas>
      </div>
      <Overlay isMobile={isMobile} />
      <div className="hero__modals">
        <ModalDetails stories={data?.results} />
        <ModalCreate stories={data?.results} />
      </div>
    </div>
  )
}

export default Hero
