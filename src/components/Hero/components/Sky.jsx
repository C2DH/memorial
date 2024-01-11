import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Clouds, Cloud } from '@react-three/drei'
import { useGLTF, useTexture } from '@react-three/drei'

import vertex from '../shaders/sky.vert'
import fragment from '../shaders/sky.frag'

import * as c from '../sceneConfig'
import { useFrame } from '@react-three/fiber'

import { usePebblesStore } from '../store'

const color = new THREE.Color('#DCF3F7').convertSRGBToLinear()

export const Sky = ({ skyColor, groundColor }) => {
  const cloudsRef = useRef()

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

  useFrame(({ camera }) => {
    const targetY = usePebblesStore.getState().hasStarted ? 0 : -8
    const targetScaleY = usePebblesStore.getState().hasStarted ? 1 : 1.25
    const targetScaleX = usePebblesStore.getState().hasStarted ? 1 : 1.25
    cloudsRef.current.position.z = camera.position.z + 8

    cloudsRef.current.position.y = THREE.MathUtils.lerp(cloudsRef.current.position.y, targetY, 0.05)
    cloudsRef.current.scale.y = THREE.MathUtils.lerp(cloudsRef.current.scale.y, targetScaleY, 0.05)
    cloudsRef.current.scale.x = THREE.MathUtils.lerp(cloudsRef.current.scale.y, targetScaleX, 0.05)
  })

  return (
    <>
      <color attach="background" args={[color]} />
      <mesh frustumCulled={false} geometry={nodes.sky.geometry}>
        <rawShaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={cloudsRef}>
        <Clouds limit={400} material={THREE.MeshBasicMaterial}>
          <Cloud
            color={[2, 3, 3]}
            seed={24}
            fade={50}
            position={[0, 48, 48]}
            speed={0.15}
            growth={16}
            volume={32}
            bounds={[40, 8, 12]}
          />
          <Cloud
            color={[2, 3, 3]}
            seed={2}
            fade={50}
            position={[0, 32, 64]}
            speed={0.5}
            growth={16}
            volume={8}
            bounds={[40, 8, 12]}
          />
        </Clouds>
      </group>
    </>
  )
}
