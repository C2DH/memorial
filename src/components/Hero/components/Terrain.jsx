import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

import vertex from '../shaders/terrain.vert'
import fragment from '../shaders/terrain.frag'

export const Terrain = ({ skyColor, groundColor, renderedTexture }) => {
  const { nodes } = useGLTF('/models.glb')

  const uniforms = useMemo(
    () => ({
      skyColor: { value: skyColor.current },
      groundColor: { value: groundColor.current },
      renderedTexture: { value: renderedTexture },
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
