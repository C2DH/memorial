import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'

import { Html, useTexture } from '@react-three/drei'

import '../styles/components/Pebble.css'
import * as THREE from 'three'
import { ModifierStack, Twist, Vector3 } from 'three.modifiers'

export const IcosahedronGeometry = 'Icosahedron'
export const Dodecaedron = 'Dodecaedron'
export const Sphere = 'Sphere'
export const Polyhedron = 'Polyhedron'
export const Octahedron = 'Octahedron'
export const Capsule = 'Capsule'

function Pebble({
  geometry = IcosahedronGeometry,
  color = '#ae96ff',
  hideTitle = true,
  scale,
  rotation,
  title,
  funcCamera,
  myIndex,
  onClick,
  twistFactor = 1,

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
    // displacementMap: '/texture/pebble-disp.jpeg',
  })
  pebbleTextures.wrapS = pebbleTextures.wrapT = THREE.RepeatWrapping

  //Switch camera to clicked pebble
  function switchToClicked() {
    if (clicked === false) {
      //unnecessary if statement :D
      funcCamera(myIndex) //Sending pebble's index to external function in HomeThreeLandscape
    }
  }

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.z += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => (document.body.style.cursor = 'auto')
  }, [hovered])

  useLayoutEffect(() => {
    console.debug('[Pebble] @useLayoutEffect twistFactor', twistFactor)
    const modifier = new ModifierStack(ref.current)
    const twist = new Twist(twistFactor)
    twist.vector = new Vector3(1, 1, 1)
    modifier.addModifier(twist)
    modifier.apply()
  }, [twistFactor, geometry])

  return (
    <mesh
      {...props}
      ref={ref}
      onClick={(event) => {
        switchToClicked(event)
        handleClick()
      }}
      rotation={[0.78, 0, 0]}
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
      {geometry === IcosahedronGeometry && <icosahedronGeometry args={[1, 0]} />}
      {geometry === Dodecaedron && <dodecahedronGeometry />}
      {geometry === Sphere && <sphereGeometry args={[1, 4, 4]} />}
      {geometry === Polyhedron && <icosahedronGeometry args={[1, 1]} />}
      {geometry === Octahedron && <octahedronGeometry args={[1.1, 1]} />}
      {geometry === Capsule && <capsuleGeometry args={[0.9, 0.4, 1, 4]} />}

      <meshStandardMaterial
        color={hovered ? '#61bfad' : color}
        {...pebbleTextures}
        map-repeat={[1, 1]}
        roughness={0.3}
        aoMapIntensity={1}
        metalness={0.4}
        // displacementScale={1}
      />
    </mesh>
  )
}

export default Pebble
