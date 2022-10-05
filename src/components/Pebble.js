import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import '../styles/components/Pebble.css'

export const Cube = 4
export const Dodecaedron = 'Dodecaedron'
export const Sphere = 'Sphere'
export const Polyhedron = 'Polyhedron'
export const Octahedron = 'Octahedron'
export const Capsule = 'Capsule'

function Pebble({ geometry = Cube, color = '#9BC995', scale, rotation, title, ...props }) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()

  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.z += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => (document.body.style.cursor = 'auto')
  }, [hovered])

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : scale}
      rotation={[0.78, 0, 0]}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      flatShading
    >
      <Html distanceFactor={10}>
        <div className="Pebble_content" style={{ display: hovered ? 'inline-block' : 'none' }}>
          {title}
        </div>
      </Html>
      {geometry === Cube && <boxGeometry args={[1, 1, 1]} />}
      {geometry === Dodecaedron && <dodecahedronGeometry />}
      {geometry === Sphere && <sphereGeometry args={[1, 16, 16]} />}
      {geometry === Polyhedron && <icosahedronGeometry />}
      {geometry === Octahedron && <octahedronGeometry />}
      {geometry === Capsule && <capsuleGeometry args={[0.9, 0.4, 1, 4]} />}

      <meshStandardMaterial color={hovered ? '#EA1744' : color} />
    </mesh>
  )
}

export default Pebble
