import React, { useRef, useEffect } from 'react'
import { Plane, useTexture } from '@react-three/drei'
import { BufferAttribute } from 'three'

function TerrainPlane() {
  const terrainTextures = useTexture({
    // map: '/rocks_diff.jpg',
    displacementMap: '/rocks_disp.jpeg',
    // aoMap: '/rocks_arm.jpeg',
    // roughnessMap: '/rocks_rough.jpeg',
    // metalnessMap: "/textures/aerial_rocks_02_arm_4k_metalness_edited.jpg",
    // normalMap: '/rocks_nor.jpeg',
    // alphaMap: "/textures/alpha.png",
  })

  const mesh = useRef(null)
  useEffect(() => {
    mesh.current.geometry.setAttribute(
      'uv2',
      new BufferAttribute(mesh.current.geometry.attributes.uv.array, 2),
    )
  })

  return (
    <Plane args={[100, 100, 200, 200]} rotation-x={-Math.PI / 2} ref={mesh} position={[0, -2.3, 0]}>
      <meshPhysicalMaterial
        color={'#43f1a8'}
        {...terrainTextures}
        displacementScale={4.5}
        flatShading
        metalness={0.13}
        // normalMap-encoding={LinearEncoding}
        // aoMapIntensity={0.5}
        roughness={0.3}
        // displacementScale={0}
      />
    </Plane>
  )
}

export default TerrainPlane
