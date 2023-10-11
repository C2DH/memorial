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

const Hero = ({ isMobile }) => {
  useEffect(() => {
    if (usePebblesStore.getState().pebblesData.length > 0) return
    usePebblesStore.getState().setInitialData()
  })

  return (
    <div className="hero">
      <div className="hero__canvas-wrapper">
        <Canvas gl={{ alpha: false, antialias: false, shadows: false }} dpr={2}>
          {/* <StatsGl /> */}
          {/* <Stats showPanel={0} /> */}
          <Camera />
          <Scene />
        </Canvas>
      </div>
      <Overlay isMobile={isMobile} />
      <div className="hero__modals">
        <ModalDetails />
        <ModalCreate />
      </div>
    </div>
  )
}

export default Hero
