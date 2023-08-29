import { useRef, useMemo, memo, useCallback } from 'react'
import { Instances, Instance, useGLTF, useTexture } from '@react-three/drei'
import useSafeFrame from '../hooks/useSafeFrame'

import * as THREE from 'three'

import { usePebblesStore } from '../store'

import vertex from '../shaders/pebble.vert'
import fragment from '../shaders/pebble.frag'

export const Pebbles = memo(({ skyColor, groundColor, renderedTexture }) => {
  const { nodes } = useGLTF('/models.glb')
  const diffuseMap = useTexture('/bakedRock.png')
  diffuseMap.flipY = false

  const pebblesData = usePebblesStore((state) => state.pebblesData)

  const uniforms = useMemo(
    () => ({
      lightDirection: { value: new THREE.Vector3(-4, 8, -2) },
      renderedTexture: { value: renderedTexture },
      diffuseMap: { value: diffuseMap },
      skyColor: { value: skyColor.current },
      groundColor: { value: groundColor.current },
    }),
    [diffuseMap, groundColor, renderedTexture, skyColor],
  )

  return (
    <Instances range={24} geometry={nodes.rock.geometry} bufferAttribute>
      <rawShaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        vertexColors
        toneMapped={false}
      />
      {pebblesData.map((props, i) => (
        <PebbleInstance key={i} idd={i} {...props} />
      ))}
    </Instances>
  )
})

const PebbleInstance = ({ idd, ...props }) => {
  const groupRef = useRef()
  const instanceRef = useRef()
  const targetRotation = useRef(0)
  const targetPositionY = useRef(0)

  const isHovered = useRef(false)

  useSafeFrame((state, delta) => {
    if (idd === usePebblesStore.getState().selected) {
      targetRotation.current += delta * 2
      targetPositionY.current = usePebblesStore.getState().pebblesData[idd].position[1] + 4
    } else {
      targetRotation.current += 0
      targetPositionY.current = usePebblesStore.getState().pebblesData[idd].position[1]
    }
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      0.015,
    )
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetPositionY.current,
      0.035,
    )
    if (isHovered.current) {
      groupRef.current.rotation.x += THREE.MathUtils.randFloatSpread(0.1)
      groupRef.current.rotation.z += THREE.MathUtils.randFloatSpread(0.1)
    }
  })

  const handleOnClick = useCallback(
    (event) => {
      usePebblesStore.getState().setSelected(idd, props.position)
      usePebblesStore.getState().setHasCreate(false)
      usePebblesStore.getState().setHasDetails(true)
      usePebblesStore.getState().setHasStarted(true)
      event.stopPropagation()
    },
    [idd, props.position],
  )

  const handleClickMiss = useCallback(() => {
    usePebblesStore.getState().setHasCreate(false)
    usePebblesStore.getState().setSelected(null)
    usePebblesStore.getState().setHasDetails(false)
  }, [])

  const handleOnPointerOver = useCallback((event) => {
    event.stopPropagation()
    isHovered.current = true
  }, [])

  const handleOnPointerOut = useCallback((event) => {
    event.stopPropagation()
    isHovered.current = false
  }, [])

  return (
    <group
      {...props}
      ref={groupRef}
      onClick={() => {
        handleOnClick()
      }}
      onPointerOver={(event) => handleOnPointerOver(event)}
      onPointerOut={(event) => handleOnPointerOut(event)}
      onPointerMissed={(event) => handleClickMiss(event)}
    >
      <Instance scale={[2, 2, 2]} ref={instanceRef} color={props.color} />
    </group>
  )
}
