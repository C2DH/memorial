import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'

import vertex from '../shaders/sky.vert'
import fragment from '../shaders/sky.frag'

export const Sky = ({ skyColor, groundColor }) => {
  const { nodes } = useGLTF('/models.glb')
  const texture = useTexture('/skyTexture.png')

  texture.flipY = false

  const uniforms = useMemo(
    () => ({
      skyColor: { value: skyColor.current },
      groundColor: { value: groundColor.current },
      skyMap: { value: texture },
    }),
    [groundColor, skyColor, texture],
  )

  return (
    <>
      <mesh frustumCulled={false} geometry={nodes.sky.geometry}>
        <rawShaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}
