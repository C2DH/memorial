import React, { useRef, useEffect } from 'react'
import { Plane, useTexture } from '@react-three/drei'
import { BufferAttribute, LinearEncoding } from 'three'

function TerrainPlane() {
  const terrainTextures = useTexture({
    map: '/rocks_diff.jpg',
    displacementMap: '/rocks_disp.jpeg',
    aoMap: '/rocks_arm.jpeg',
    roughnessMap: '/rocks_rough.jpeg',
    // metalnessMap: "/textures/aerial_rocks_02_arm_4k_metalness_edited.jpg",
    normalMap: '/rocks_nor.jpeg',
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
    <Plane args={[40, 40, 128, 128]} rotation-x={-Math.PI / 2} ref={mesh} position={[0, -1.3, 0]}>
      <meshStandardMaterial
        {...terrainTextures}
        displacementScale={1}
        normalMap-encoding={LinearEncoding}
        aoMapIntensity={1}
        roughness={0.9}
        // displacementScale={0}
      />
    </Plane>
  )
}

export default TerrainPlane
