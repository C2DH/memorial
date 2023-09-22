import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'

import vertex from '../shaders/sky.vert'
import fragment from '../shaders/sky.frag'

import vertexB from '../shaders/bg.vert'
import fragmentB from '../shaders/bg.frag'

import * as c from '../sceneConfig'

/* TODO: ZOOM IN ON SCROLL */

export const Sky = ({ skyColor, groundColor }) => {
  const { nodes } = useGLTF('/models/models.glb')
  const texture = useTexture('/texture/skyTexture.png')

  texture.flipY = false

  const uniforms = useMemo(
    () => ({
      skyColor: { value: skyColor.current },
      groundColor: { value: groundColor.current },
      skyMap: { value: texture },
      zOffset: { value: c.sceneOffsetZ },
    }),
    [groundColor, skyColor, texture],
  )

  return (
    <>
      <mesh scale={1} frustumCulled={false}>
        <sphereGeometry args={[256, 32, 32]} />
        <rawShaderMaterial
          vertexShader={vertexB}
          fragmentShader={fragmentB}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
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
