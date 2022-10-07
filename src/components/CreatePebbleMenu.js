import Modal from 'react-bootstrap/Modal'
import { Canvas } from '@react-three/fiber'
import Pebble, { Capsule, Octahedron, Cube, Sphere, Polyhedron, Dodecaedron } from './Pebble'
import { PebbleIconOctahedron } from './SvgIcons'
import '../styles/components/CreatePebbleMenu.css'
import React, { useState } from 'react'
import { PebbleColors } from '../constants'
import { useTranslation } from 'react-i18next'

const CreatePebbleMenu = ({ show, handleClose }) => {
  const [shape, setShape] = useState(Octahedron)
  const [color, setColor] = useState(PebbleColors[0])
  const { t } = useTranslation()

  return (
    <>
      {/* <button variant="primary">Launch demo modal</button> */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('actionCreateAPebble')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content-wrapper w-100 h-100">
            <h5>Pebble Shape</h5>
            <div className="pebble-shape-btn-g">
              <button
                onClick={() => setShape(Octahedron)}
                className="pebble-shape-btn btn btn-white btn-lg"
              >
                <PebbleIconOctahedron></PebbleIconOctahedron>
              </button>
              <button
                onClick={() => setShape(Cube)}
                className="pebble-shape-btn btn btn-white btn-lg"
              >
                <PebbleIconOctahedron></PebbleIconOctahedron>
              </button>
              <button
                onClick={() => setShape(Capsule)}
                className="pebble-shape-btn btn btn-white btn-lg"
              >
                <PebbleIconOctahedron></PebbleIconOctahedron>
              </button>
              <button
                onClick={() => setShape(Sphere)}
                className="pebble-shape-btn btn btn-white btn-lg"
              >
                <PebbleIconOctahedron></PebbleIconOctahedron>
              </button>
              <button
                onClick={() => setShape(Polyhedron)}
                className="pebble-shape-btn btn btn-white btn-lg"
              >
                <PebbleIconOctahedron></PebbleIconOctahedron>
              </button>
              <button
                onClick={() => setShape(Dodecaedron)}
                className="pebble-shape-btn btn btn-white btn-lg"
              >
                <PebbleIconOctahedron></PebbleIconOctahedron>
              </button>
            </div>
            <h5>Pebble Color</h5>
            <div className="pebble-color-btn-g">
              {PebbleColors.map((c, i) => (
                <button
                  className="pebble-color-btn btn btn-sm"
                  style={{ backgroundColor: c }}
                  key={i}
                  onClick={() => setColor(c)}
                ></button>
              ))}
            </div>
          </div>
          <div className="w-100" style={{ height: 200 }}>
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <Pebble
                hideTitle
                onClick={() => {
                  console.info('úseless here')
                }}
                geometry={shape}
                color={color}
                scale={2.5}
              ></Pebble>
            </Canvas>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-white btn-lg" onClick={handleClose}>
            Create
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreatePebbleMenu
