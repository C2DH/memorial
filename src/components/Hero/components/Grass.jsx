import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'

import vertex from '../shaders/grass.vert'
import fragment from '../shaders/grass.frag'

import * as c from '../sceneConfig'

export const Grass = ({ skyColor, groundColor, renderedTexture }) => {
  const { nodes } = useGLTF('/models/models2.glb')
  const texBlade = useTexture('/texture/textures.png')
  const grassNormals = useTexture('/texture/grassNormals.png')
  const grassBendNormals = useTexture('/texture/grassBendNormals.png')
  const grassDisplacement = useTexture('/texture/grassDisplacement.png')

  texBlade.flipY = false
  grassNormals.flipY = false
  grassBendNormals.flipY = false
  grassDisplacement.flipY = false

  const meshRef = useRef()

  const instances = 164 * 164

  const { instData } = useMemo(() => generateInstancesData(instances), [instances])

  const uniforms = useMemo(
    () => ({
      radius: { value: c.sceneRadius },
      instanceCount: { value: instances },
      renderedTexture: { value: renderedTexture },
      texBlade: { value: texBlade },
      grassNormals: { value: grassNormals },
      grassBendNormals: { value: grassBendNormals },
      grassDisplacement: { value: grassDisplacement },
      skyColor: { value: skyColor.current },
      groundColor: { value: groundColor.current },
      zOffset: { value: c.sceneOffsetZ },
      lightDirection: { value: new THREE.Vector3(-48, 48 * 2, 0) },
      terrainAmplitude: { value: c.terrainAmplitude },
    }),
    [
      grassBendNormals,
      grassDisplacement,
      grassNormals,
      groundColor,
      instances,
      renderedTexture,
      skyColor,
      texBlade,
    ],
  )

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]} frustumCulled={false}>
        <instancedBufferGeometry instanceCount={instances}>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.grass.geometry.attributes.position.array.length}
            array={nodes.grass.geometry.attributes.position.array}
            itemSize={nodes.grass.geometry.attributes.position.itemSize}
            normalized={nodes.grass.geometry.attributes.position.normalized}
          />
          <bufferAttribute
            attach="attributes-normal"
            count={nodes.grass.geometry.attributes.normal.array.length}
            array={nodes.grass.geometry.attributes.normal.array}
            itemSize={nodes.grass.geometry.attributes.normal.itemSize}
            normalized={nodes.grass.geometry.attributes.normal.normalized}
          />
          <bufferAttribute
            attach="index"
            count={nodes.grass.geometry.index.array.length}
            array={nodes.grass.geometry.index.array}
            itemSize={nodes.grass.geometry.index.itemSize}
            normalized={nodes.grass.geometry.index.normalized}
          />
          <bufferAttribute
            attach="attributes-uv"
            count={nodes.grass.geometry.attributes.uv.array.length}
            array={nodes.grass.geometry.attributes.uv.array}
            itemSize={nodes.grass.geometry.attributes.uv.itemSize}
            normalized={nodes.grass.geometry.attributes.uv.normalized}
          />
          <instancedBufferAttribute
            attach="attributes-instaceData"
            count={instances}
            array={instData}
            itemSize={1}
          />
        </instancedBufferGeometry>
        <rawShaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          side={THREE.DoubleSide}
          uniforms={uniforms}
        />
      </mesh>
    </>
  )
}

const generateInstancesData = (instances) => {
  const instData = new Float32Array(instances)

  for (let i = 0; i < instances; i++) {
    instData[i] = i + Math.random()
  }

  return { instData }
}
