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

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero__canvas-wrapper">
        <Canvas gl={{ alpha: true, antialias: true }} resize={{ scroll: false }}>
          <Camera />
          <Scene />
        </Canvas>
      </div>
      <Overlay />
      <ModalDetails />
      <ModalCreate />
    </div>
  )
}

export default Hero
