import { useRef, useMemo, memo, useCallback } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'

import { usePebblesStore } from '../store'

import vertex from '../shaders/pebble.vert'
import fragment from '../shaders/pebble.frag'

import * as c from '../sceneConfig'

const tempObject = new THREE.Object3D()

export const Pebbles = memo(({ skyColor, groundColor, renderedTexture }) => {
  const { nodes } = useGLTF('/models/models.glb')

  const diffuseMap = useTexture('/texture/pebbleColor.png')
  const normalMap = useTexture('/texture/pebbleBakedNormalsOBJ.png')
  diffuseMap.flipY = false
  normalMap.flipY = false

  const instancedMeshRef = useRef()
  const tempColorRef = useRef(new THREE.Color())

  const highlights = useRef(new Float32Array(24))
  const highlightAttribute = new THREE.InstancedBufferAttribute(highlights.current, 1)

  nodes.pebble.geometry.setAttribute('highlight', highlightAttribute)

  const uniforms = useMemo(
    () => ({
      lightDirection: { value: new THREE.Vector3(-48, 48 * 2, 0) },
      renderedTexture: { value: renderedTexture },
      diffuseMap: { value: diffuseMap },
      normalMap: { value: normalMap },
      skyColor: { value: skyColor.current },
      groundColor: { value: groundColor.current },
      zOffset: { value: c.sceneOffsetZ },
    }),
    [diffuseMap, normalMap, groundColor, renderedTexture, skyColor],
  )

  const { setSelected, resetSelected, setHasCreate, setHasDetails, setHasStarted, pebblesData } =
    usePebblesStore.getState()

  const handleOnClick = useCallback(
    (event) => {
      const { instanceId } = event
      const data = relevantDataRef.current[instanceId]
      setSelected(data)
      setHasCreate(false)
      setHasDetails(true)
      setHasStarted(true)
      event.stopPropagation()
    },
    [setSelected, setHasCreate, setHasDetails, setHasStarted],
  )

  const handlePointerMiss = useCallback(() => {
    setHasCreate(false)
    resetSelected()
    setHasDetails(false)
  }, [setHasCreate, setHasDetails, resetSelected])

  const lastChunkIndex = useRef(null)
  const relevantDataRef = useRef([])
  const previousPebblesCount = useRef(0)

  const updateRelevantData = (currentChunkIndex) => {
    lastChunkIndex.current = currentChunkIndex
    const startChunk = Math.min(Math.max(0, currentChunkIndex - 1), pebblesData.length - 1)
    const nextChunk = Math.min(pebblesData.length - 1, startChunk + 1)
    const endChunk = Math.min(pebblesData.length - 1, startChunk + 2)
    console.info(`CURRENT CHUNKS: ${startChunk} - ${nextChunk} - ${endChunk}`)
    relevantDataRef.current = [
      ...pebblesData[startChunk],
      ...pebblesData[nextChunk],
      ...pebblesData[endChunk],
    ]
  }

  const updateInstancedMesh = (cameraPositionZ, pebble, count, delta) => {
    tempObject.position.set(
      pebble.position[0],
      pebble.position[1],
      pebble.position[2] + c.sceneOffsetZ,
    )
    tempObject.rotation.x = pebble.rotation[0]
    tempObject.rotation.y = pebble.rotation[1]
    tempObject.rotation.z = pebble.rotation[2]

    tempObject.updateMatrix()

    const isInView = cameraPositionZ - tempObject.position.z > -c.sceneRadius - c.sceneOffsetZ
    const isSelected = pebble.uid === usePebblesStore.getState().selectedPebble?.uid

    if (isInView) {
      instancedMeshRef.current.setMatrixAt(count, tempObject.matrix)

      tempColorRef.current.set(pebble.color)
      instancedMeshRef.current.setColorAt(count, tempColorRef.current)

      highlights.current[count] = THREE.MathUtils.lerp(
        highlights.current[count],
        isSelected ? 1 : 0,
        delta,
      )

      instancedMeshRef.current.geometry.attributes.highlight.needsUpdate = true

      instancedMeshRef.current.instanceMatrix.needsUpdate = true
      instancedMeshRef.current.instanceColor.needsUpdate = true
    }
  }

  useFrame(({ camera }, delta) => {
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
      updateInstancedMesh(cameraPositionZ, pebble, count, delta)
      count++
    })

    instancedMeshRef.current.computeBoundingSphere()

    // infoRef.current.position.x = infoPosRef.current.x
    // infoRef.current.position.y = infoPosRef.current.y
    // infoRef.current.position.z = infoPosRef.current.z
  })

  // const infoRef = useRef()
  // const infoPosRef = useRef(new THREE.Vector3())

  return (
    <>
      {/* <group ref={infoRef}>
        <Html as="div">
          <h1>hello</h1>
          <p>world</p>
        </Html>
      </group> */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[nodes.pebble.geometry, null, 24]}
        frustumCulled={false}
        onClick={handleOnClick}
        onPointerMissed={handlePointerMiss}
        // onPointerOver={(e) => {
        //   console.log(e)
        //   infoPosRef.current.copy(e.point)
        // }}
      >
        <rawShaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          attach="material"
        />
      </instancedMesh>
    </>
  )
})
