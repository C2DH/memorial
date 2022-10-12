import Modal from 'react-bootstrap/Modal'
import { Canvas } from '@react-three/fiber'
import Pebble, {
  Capsule,
  Octahedron,
  IcosahedronGeometry,
  Sphere,
  Polyhedron,
  Dodecaedron,
} from './Pebble'
import '../styles/components/CreatePebbleMenu.css'
import React, { useRef, useState, useMemo } from 'react'
import { PebbleColors } from '../constants'
import { useTranslation } from 'react-i18next'
import { PlusCircle, ChevronLeft, ChevronRight } from 'react-feather'
import { useSpring, easings } from 'react-spring'
import { Vector3 } from 'three'
import { PerspectiveCamera } from '@react-three/drei'

const ShapeGeometries = [Octahedron, IcosahedronGeometry, Capsule, Sphere, Polyhedron, Dodecaedron]

const CreatePebbleMenu = ({ show, handleClose }) => {
  const [shape, setShape] = useState(Octahedron)
  const [color, setColor] = useState(PebbleColors[0])
  const { t } = useTranslation()
  //   const canvasRef = useRef(null)

  //   const cameraRef = useRef()
  //   const [, setCameraPosition] = useSpring(() => ({
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //     config: {
  //       duration: 2700,
  //       easing: easings.easeInOutQuart,
  //     },
  //     onChange: (e) => {
  //       cameraRef.current.target = new Vector3(e.value.x, e.value.y, e.value.z)
  //     },
  //   }))

  //   const pebblePositions = useMemo(() => {
  //     let x = 0
  //     return ShapeGeometries.map((d, i) => {
  //       x += 2
  //       const y = 2
  //       const z = 2
  //       return [x, y, z]
  //     })
  //   }, ShapeGeometries)

  //   setCameraPosition.start({
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //   })

  //   setTimeout(() => {
  //     console.info('canvasRef', canvasRef, 'pebblePositions', pebblePositions)
  //     debugger
  //   }, 2000)

  return (
    <>
      {/* <button variant="primary">Launch demo modal</button> */}

      <Modal className="create-pebble-menu" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <PlusCircle />
            <b className="ms-2">{t('modalTitleCreateAPebble')}</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content-wrapper w-100">
            <h5>{t('modalPebbleShape')}</h5>
            <div className="canva-wrapper w-100">
              <ChevronLeft className="chevron-icon" />
              <ChevronRight className="chevron-icon" />
              <Canvas>
                <PerspectiveCamera position={[0, 0, 0]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                {ShapeGeometries.map((pebblePositions, i) => (
                  <Pebble
                    // ref={canvasRef}
                    position={[0, 0, 0]}
                    hideTitle
                    onClick={() => {}}
                    geometry={'Octahedron'}
                    color={color}
                    scale={2.5}
                    key={i}
                  ></Pebble>
                ))}
              </Canvas>
            </div>
            {/* <div className="pebble-shape-btn-g">
              {[Octahedron, IcosahedronGeometry, Capsule, Sphere, Polyhedron, Dodecaedron].map(
                (geometry, i) => (
                  <button
                    key={i}
                    onClick={() => setShape(geometry)}
                    className={`pebble-shape-btn btn btn-white btn-lg ${
                      shape === geometry ? 'active' : ''
                    }`}
                  >
                    <PebbleIconOctahedron></PebbleIconOctahedron>
                  </button>
                ),
              )}
            </div> */}
            <h5>{t('modalPebbleColor')}</h5>
            <div className="pebble-color-btn-g">
              {PebbleColors.map((c, i) => (
                <button
                  className={`pebble-color-btn btn btn-sm ${color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  key={i}
                  onClick={() => setColor(c)}
                ></button>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-white btn-lg" onClick={handleClose}>
            {t('actionModalCreatePebble')}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreatePebbleMenu
