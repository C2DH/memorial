import { useRef, useMemo, memo, useCallback } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'

import { usePebblesStore } from '../store'

import vertex from '../shaders/pebble.vert'
import fragment from '../shaders/pebble.frag'

import * as c from '../sceneConfig'

export const Pebbles = memo(({ skyColor, groundColor, renderedTexture }) => {
  const { nodes } = useGLTF('/models.glb')

  const diffuseMap = useTexture('/bakedRock.png')
  diffuseMap.flipY = false

  const instancedMeshRef = useRef()

  const _tempPebblePostionRef = useRef(new THREE.Vector3(0, 0, 0))
  const _tempPebbleMat4 = useRef(new THREE.Matrix4())

  const lightDirection = useMemo(() => new THREE.Vector3(-4, 8, -2), [])

  const uniforms = useMemo(
    () => ({
      lightDirection: { value: lightDirection },
      renderedTexture: { value: renderedTexture },
      diffuseMap: { value: diffuseMap },
      skyColor: { value: skyColor.current },
      groundColor: { value: groundColor.current },
      zOffset: { value: c.sceneOffsetZ },
    }),
    [diffuseMap, groundColor, renderedTexture, skyColor, lightDirection],
  )

  const { setSelected, setHasCreate, setHasDetails, setHasStarted, pebblesData } =
    usePebblesStore.getState()

  const handleOnClick = useCallback(
    (event) => {
      const position = [
        pebblesData[event.instanceId].position[0],
        pebblesData[event.instanceId].position[1],
        pebblesData[event.instanceId].position[2],
      ]
      setSelected(event.instanceId, position)
      setHasCreate(false)
      setHasDetails(true)
      setHasStarted(true)
      event.stopPropagation()
    },
    [pebblesData, setSelected, setHasCreate, setHasDetails, setHasStarted],
  )

  const handlePointerMiss = useCallback(() => {
    setHasCreate(false)
    setSelected(null)
    setHasDetails(false)
  }, [setHasCreate, setSelected, setHasDetails])

  useFrame(({ camera }) => {
    let count = 0
    const cameraPosition = camera.position.clone().z
    const currentChunkIndex = Math.floor(cameraPosition / c.chunkSize)
    const startChunk = Math.max(0, currentChunkIndex - 1)
    const endChunk = Math.min(pebblesData.length - 1, currentChunkIndex + 1)
    const relevantData = [].concat(...pebblesData.slice(startChunk, endChunk + 1))

    relevantData.forEach((pebble, i) => {
      _tempPebblePostionRef.current.set(
        pebble.position[0],
        pebble.position[1],
        pebble.position[2] + c.sceneOffsetZ,
      )

      const isInView =
        cameraPosition - _tempPebblePostionRef.current.z > -c.sceneRadius - c.sceneOffsetZ

      if (isInView) {
        _tempPebbleMat4.current.setPosition(_tempPebblePostionRef.current)
        instancedMeshRef.current.setMatrixAt(count, _tempPebbleMat4.current)
        instancedMeshRef.current.setColorAt(count, new THREE.Color(pebble.color))
      }

      count++
    })

    instancedMeshRef.current.instanceMatrix.needsUpdate = true
    instancedMeshRef.current.instanceColor.needsUpdate = true
    instancedMeshRef.current.computeBoundingSphere()
  })

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[nodes.rock.geometry, null, 64]}
      frustumCulled={false}
      onClick={handleOnClick}
      onPointerMissed={handlePointerMiss}
    >
      <rawShaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        attach="material"
      />
    </instancedMesh>
  )
})
