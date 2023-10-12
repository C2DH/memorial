import { useRef, useMemo, memo, useCallback, useState, useEffect } from 'react'
import { useGLTF, useTexture, Instances, Instance } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'

import { usePebblesStore } from '../store'

import vertex from '../shaders/pebble.vert'
import fragment from '../shaders/pebble.frag'

import * as c from '../sceneConfig'

export const Pebbles = memo(({ skyColor, groundColor, renderedTexture }) => {
  const { nodes } = useGLTF('/models/models.glb')

  const diffuseMap = useTexture('/texture/pebbleColor.png')
  const normalMap = useTexture('/texture/pebbleBakedNormalsOBJ.png')
  diffuseMap.flipY = false
  normalMap.flipY = false

  const highlights = useRef(new Float32Array(32).fill(0))
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

  return (
    <>
      <Instances limit={32} range={32} geometry={nodes.pebble.geometry} frustumCulled={false}>
        <rawShaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          attach="material"
        />
        <InstancedPebbles highlights={highlights} />
      </Instances>
    </>
  )
})

const InstancedPebbles = ({ highlights }) => {
  const pebbles = usePebblesStore((state) => state.pebblesData)

  const [filteredPebbles, setFilteredPebbles] = useState([])
  const lastCameraPosZ = useRef(null)
  const lastPebbleLength = useRef(null)

  function roundToNearestTen(num) {
    return Math.round(num / 40) * 40
  }

  useFrame(({ camera }) => {
    const currentCameraPosZ = roundToNearestTen(camera.position.z)

    if (
      currentCameraPosZ !== lastCameraPosZ.current ||
      pebbles.length !== lastPebbleLength.current
    ) {
      lastCameraPosZ.current = roundToNearestTen(camera.position.z)
      lastPebbleLength.current = pebbles.length
      setFilteredPebbles(
        pebbles.filter((pebble) => {
          const zDistance = Math.abs(camera.position.z - pebble.position[2])
          return zDistance < 120
        }),
      )
      console.info('chunk updated')
    }
  })

  return (
    <>
      {filteredPebbles.map((pebble, i) => (
        <SingleInstance
          pebble={pebble}
          filteredPebbles={filteredPebbles}
          key={pebble.uid}
          highlights={highlights}
          i={i}
        />
      ))}
    </>
  )
}

const SingleInstance = ({ pebble, filteredPebbles, highlights, i }) => {
  const handleOnClick = useCallback(
    (event) => {
      const data = filteredPebbles[i]
      usePebblesStore.getState().setSelected(data)
      usePebblesStore.getState().setHasCreate(false)
      usePebblesStore.getState().setHasDetails(true)
      usePebblesStore.getState().setHasStarted(true)
      event.stopPropagation()
    },
    [filteredPebbles, i],
  )

  const handlePointerMiss = useCallback(() => {
    usePebblesStore.getState().setHasCreate(false)
    usePebblesStore.getState().resetSelected()
    usePebblesStore.getState().setHasDetails(false)
  }, [])

  const instanceRef = useRef()

  const targetPosY = useRef(0)
  const targetRotation = useRef(0)

  useFrame((_, delta) => {
    const hasSelected = usePebblesStore.getState().selectedPebble
    if (hasSelected) {
      const isSelected =
        pebble.position[2] === usePebblesStore.getState().selectedPebble.position[2]
      if (isSelected) {
        targetPosY.current = pebble.position[1] + 4
        targetRotation.current = pebble.rotation[2] + Math.PI
      } else {
        targetPosY.current = pebble.position[1]
        targetRotation.current = pebble.rotation[2]
      }

      highlights.current[i] = THREE.MathUtils.lerp(highlights.current[i], isSelected ? 1 : 0, delta)
    } else {
      highlights.current[i] = THREE.MathUtils.lerp(highlights.current[i], 0, delta)
      targetPosY.current = pebble.position[1]
      targetRotation.current = pebble.rotation[2]
    }

    instanceRef.current.geometry.attributes.highlight.needsUpdate = true

    instanceRef.current.position.y = THREE.MathUtils.lerp(
      instanceRef.current.position.y,
      targetPosY.current,
      1 * delta,
    )
    instanceRef.current.rotation.z = THREE.MathUtils.lerp(
      instanceRef.current.rotation.z,
      targetRotation.current,
      0.5 * delta,
    )
  })

  return (
    <group>
      <Instance
        ref={instanceRef}
        position={pebble.position}
        rotation={pebble.rotation}
        color={pebble.color}
        onClick={handleOnClick}
        onPointerMissed={handlePointerMiss}
      ></Instance>
    </group>
  )
}
