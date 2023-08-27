import React, { useRef, useEffect } from 'react'
import { Plane, useTexture } from '@react-three/drei'
import { BufferAttribute } from 'three'
import * as THREE from 'three'

function TerrainPlane() {
  const terrainTextures = useTexture({
    map: '/texture/rocks_diff.jpg',
    displacementMap: '/texture/rocks_disp.jpeg',
    aoMap: '/texture/rocks_arm.jpeg',
    roughnessMap: '/texture/rocks_rough.jpeg',
    // metalnessMap: "/textures/aerial_rocks_02_arm_4k_metalness_edited.jpg",
    // normalMap: '/texture/rocks_nor.jpeg',
    // alphaMap: "/textures/alpha.png",
  })
  terrainTextures.wrapS = terrainTextures.wrapT = THREE.RepeatWrapping

  const mesh = useRef(null)
  useEffect(() => {
    mesh.current.geometry.setAttribute(
      'uv2',
      new BufferAttribute(mesh.current.geometry.attributes.uv.array, 2),
    )
  })

  return (
    <Plane args={[100, 100, 200, 200]} rotation-x={-Math.PI / 2} ref={mesh} position={[0, -2.3, 0]}>
      <meshStandardMaterial
        color={'#a4e4ff'}
        {...terrainTextures}
        map-repeat={[1, 1]}
        displacementScale={4.5}
        flatShading
        // metalness={0}
        // aoMapIntensity={0}
        roughness={1}
        // displacementScale={0}
      />
    </Plane>
  )
}

export default TerrainPlane
