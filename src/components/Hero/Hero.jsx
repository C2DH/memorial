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
import { StatsGl, Stats } from '@react-three/drei'

import { useEffect } from 'react'
import { usePebblesStore } from './store'

import * as THREE from 'three'

const color = new THREE.Color('#DCF3F7').convertSRGBToLinear()

const Hero = () => {
  useEffect(() => {
    usePebblesStore.getState().setInitialData()
  }, [])

  return (
    <div className="hero">
      <ScrollController>
        <div className="hero__canvas-wrapper">
          <Canvas gl={{ alpha: false, antialias: false, shadows: false }} dpr={2}>
            {/* <StatsGl /> */}
            {/* <Stats showPanel={0} /> */}
            <color attach="background" args={[color]} />
            <Camera />
            <Scene />
          </Canvas>
        </div>
      </ScrollController>
      <Overlay />
      <div className="hero__modals">
        <ModalDetails />
        <ModalCreate />
      </div>
    </div>
  )
}

export default Hero
