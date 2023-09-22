import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

import vertex from '../shaders/terrain.vert'
import fragment from '../shaders/terrain.frag'
import * as c from '../sceneConfig'

export const Terrain = ({ skyColor, groundColor, renderedTexture }) => {
  const { nodes } = useGLTF('/models/models.glb')

  const uniforms = useMemo(
    () => ({
      skyColor: { value: skyColor.current },
      groundColor: { value: groundColor.current },
      renderedTexture: { value: renderedTexture },
      zOffset: { value: c.sceneOffsetZ },
    }),
    [skyColor, groundColor, renderedTexture],
  )

  return (
    <mesh geometry={nodes.terrain.geometry} frustumCulled={false}>
      <rawShaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  )
}
