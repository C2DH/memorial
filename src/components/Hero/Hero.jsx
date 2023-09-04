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
import { ScrollController } from './components/ScrollController'
// eslint-disable-next-line no-unused-vars
import { OrbitControls, StatsGl } from '@react-three/drei'

import { useEffect } from 'react'
import { usePebblesStore } from './store'

const Hero = () => {
  useEffect(() => {
    usePebblesStore.getState().setInitialData()
  }, [])

  return (
    <div className="hero">
      <ScrollController>
        <div className="hero__canvas-wrapper">
          <Canvas gl={{ alpha: true, antialias: true }} resize={{ scroll: false }}>
            <StatsGl />
            <Camera />
            {/* <OrbitControls /> */}
            <Scene />
          </Canvas>
        </div>
      </ScrollController>
      <Overlay />
      <ModalDetails />
      <ModalCreate />
    </div>
  )
}

export default Hero
