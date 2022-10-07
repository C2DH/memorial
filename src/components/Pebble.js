import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import '../styles/components/Pebble.css'
import * as THREE from 'three'

export const Cube = 4
export const Dodecaedron = 'Dodecaedron'
export const Sphere = 'Sphere'
export const Polyhedron = 'Polyhedron'
export const Octahedron = 'Octahedron'
export const Capsule = 'Capsule'

function Pebble({
  geometry = Cube,
  color = '#7dc0ff',
  hideTitle = false,
  scale,
  rotation,
  title,
  onClick,
  ...props
}) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()

  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  const handleClick = (e) => {
    if (typeof onClick === 'function') {
      onClick(e, clicked)
    } else {
      click(!clicked)
    }
  }

  const pebbleTextures = useTexture({
    map: '/texture/pebble-diff.jpeg',
    roughnessMap: '/texture/pebble-rough.jpeg',
    normalMap: '/texture/pebble-nor.jpeg',
    metalnessMap: '/texture/pebble-met.jpeg',
  })
  pebbleTextures.wrapS = pebbleTextures.wrapT = THREE.RepeatWrapping

  // const mesh = useRef(null)
  // useEffect(() => {
  //   mesh.current.geometry.setAttribute(
  //     'uv2',
  //     new BufferAttribute(mesh.current.geometry.attributes.uv.array, 2),
  //   )
  // })

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
      onClick={handleClick}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      flatShading
    >
      {hideTitle ? null : (
        <Html distanceFactor={10}>
          <div className="Pebble_content" style={{ display: hovered ? 'inline-block' : 'none' }}>
            {title}
          </div>
        </Html>
      )}
      {geometry === Cube && <boxGeometry args={[1.2, 1.2, 1.2, 1, 1, 1]} />}
      {geometry === Dodecaedron && <dodecahedronGeometry />}
      {geometry === Sphere && <sphereGeometry args={[1, 16, 16]} />}
      {geometry === Polyhedron && <icosahedronGeometry />}
      {geometry === Octahedron && <octahedronGeometry args={[1.1, 0]} />}
      {geometry === Capsule && <capsuleGeometry args={[0.9, 0.4, 1, 4]} />}

      <meshStandardMaterial
        color={hovered ? '#EA1744' : color}
        {...pebbleTextures}
        map-repeat={[1, 1]}
        roughness={0.3}
        aoMapIntensity={1}
        metalness={0.4}
        // normalMap={normalMap}
      />
    </mesh>
  )
}

export default Pebble
