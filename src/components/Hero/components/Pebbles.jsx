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
  const tempPebblePostionRef = useRef(new THREE.Vector3(0, 0, 0))
  const tempPebbleMat4 = useRef(new THREE.Matrix4())
  const tempColorRef = useRef(new THREE.Color())

  const uniforms = useMemo(
    () => ({
      lightDirection: { value: new THREE.Vector3(-4, 8, -2) },
      renderedTexture: { value: renderedTexture },
      diffuseMap: { value: diffuseMap },
      skyColor: { value: skyColor.current },
      groundColor: { value: groundColor.current },
      zOffset: { value: c.sceneOffsetZ },
    }),
    [diffuseMap, groundColor, renderedTexture, skyColor],
  )

  const { setSelected, setHasCreate, setHasDetails, setHasStarted, pebblesData } =
    usePebblesStore.getState()

  const handleOnClick = useCallback(
    (event) => {
      const { instanceId } = event
      const { position } = relevantDataRef.current[instanceId]
      setSelected(instanceId, position)
      setHasCreate(false)
      setHasDetails(true)
      setHasStarted(true)
      event.stopPropagation()
    },
    [setSelected, setHasCreate, setHasDetails, setHasStarted],
  )

  const handlePointerMiss = useCallback(() => {
    setHasCreate(false)
    setSelected(null)
    setHasDetails(false)
  }, [setHasCreate, setSelected, setHasDetails])

  const lastChunkIndex = useRef(null)
  const relevantDataRef = useRef([])
  const previousPebblesCount = useRef(0)

  const updateRelevantData = (currentChunkIndex) => {
    lastChunkIndex.current = currentChunkIndex
    const startChunk = Math.max(0, currentChunkIndex - 1)
    const nextChunk = Math.min(pebblesData.length - 1, startChunk + 1)
    const endChunk = Math.min(pebblesData.length - 1, startChunk + 2)
    console.info(`CURRENT CHUNKS: ${startChunk} - ${nextChunk} - ${endChunk}`)
    relevantDataRef.current = [
      ...pebblesData[startChunk],
      ...pebblesData[nextChunk],
      ...pebblesData[endChunk],
    ]
  }

  const updateInstancedMesh = (cameraPositionZ, pebble, count) => {
    tempPebblePostionRef.current.set(
      pebble.position[0],
      pebble.position[1],
      pebble.position[2] + c.sceneOffsetZ,
    )

    const isInView =
      cameraPositionZ - tempPebblePostionRef.current.z > -c.sceneRadius - c.sceneOffsetZ

    if (isInView) {
      tempPebbleMat4.current.setPosition(tempPebblePostionRef.current)
      instancedMeshRef.current.setMatrixAt(count, tempPebbleMat4.current)
      tempColorRef.current.set(pebble.color)
      instancedMeshRef.current.setColorAt(count, tempColorRef.current)
    }
  }

  useFrame(({ camera }) => {
    if (pebblesData.length === 0) return
    let count = 0
    const cameraPositionZ = camera.position.clone().z
    const currentChunkIndex = Math.floor(cameraPositionZ / c.chunkSize)

    if (lastChunkIndex.current !== currentChunkIndex) {
      updateRelevantData(currentChunkIndex)
    }

    if (previousPebblesCount.current !== usePebblesStore.getState().pebblesCount) {
      previousPebblesCount.current = usePebblesStore.getState().pebblesCount
      updateRelevantData(currentChunkIndex)
    }

    relevantDataRef.current.forEach((pebble, i) => {
      updateInstancedMesh(cameraPositionZ, pebble, count)
      count++
    })

    instancedMeshRef.current.instanceMatrix.needsUpdate = true
    instancedMeshRef.current.instanceColor.needsUpdate = true
    instancedMeshRef.current.computeBoundingSphere()
  })

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[nodes.rock.geometry, null, 24]}
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
