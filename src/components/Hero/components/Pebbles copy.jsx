import { useRef, useMemo, memo, useCallback, useState, useEffect } from 'react'
import { useGLTF, useTexture, Instances, Instance, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

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

  const handleMouseOver = useCallback((event) => {
    mouseOver.current = true
    event.stopPropagation()
  }, [])

  const handleMouseOut = useCallback((event) => {
    mouseOver.current = false
    event.stopPropagation()
  }, [])

  const labelRef = useRef()
  const textRef = useRef()

  const instanceRef = useRef()
  const mouseOver = useRef(false)

  const targetPosY = useRef(0)
  const targetRotation = useRef(0)

  const myPebbles = JSON.parse(localStorage.getItem('myPebbles')) || []
  const isMyPebble = myPebbles.includes(pebble.uid)

  useFrame(({ camera }, delta) => {
    const hasSelected = usePebblesStore.getState().selectedPebble
    if (hasSelected) {
      const isSelected = pebble.uid === usePebblesStore.getState().selectedPebble.uid
      if (isSelected) {
        targetPosY.current = pebble.position[1] + 4
        targetRotation.current = pebble.rotation[2] + Math.PI
      } else {
        targetPosY.current = pebble.position[1]
        targetRotation.current = pebble.rotation[2]
      }

      highlights.current[i] = THREE.MathUtils.lerp(highlights.current[i], isSelected ? 1 : 0, delta)
    } else {
      highlights.current[i] = THREE.MathUtils.lerp(highlights.current[i], isMyPebble ? 1 : 0, delta)
      targetPosY.current = pebble.position[1]
      targetRotation.current = pebble.rotation[2]
    }

    if (mouseOver.current === true) {
      labelRef.current.style.opacity = THREE.MathUtils.lerp(labelRef.current.style.opacity, 1, 0.05)
      textRef.current.style.opacity = THREE.MathUtils.lerp(textRef.current.style.opacity, 1, 0.05)
    } else {
      labelRef.current.style.opacity = THREE.MathUtils.lerp(
        labelRef.current.style.opacity,
        0.25,
        0.05,
      )
      textRef.current.style.opacity = THREE.MathUtils.lerp(textRef.current.style.opacity, 0, 0.05)
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
        onPointerOver={handleMouseOver}
        onPointerOut={handleMouseOut}
      />
      <group position={[pebble.position[0], pebble.position[1] + 4, pebble.position[2]]}>
        <Html
          as="div"
          wrapperClass
          prepend
          center
          fullscreen
          distanceFactor={10}
          zIndexRange={[100, 0]}
          transform
          sprite
          pointerEvents="none"
        >
          <div
            ref={labelRef}
            style={{
              background: 'var(--linen-500, #fcede2)',
              padding: '0.75rem 2rem',
              borderRadius: '4rem',
              color: 'var(--bs-primary-text)',
              font: 'var(--heading-m)',
            }}
          >
            <div
              ref={textRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.15rem',
              }}
            >
              {isMyPebble && <p>THIS IS MY PEBBLE</p>}
              <div>by {pebble.createdBy}</div>
              <div
                style={{
                  font: 'var(--text-m)',
                }}
              >
                on {t('dateShort', { date: new Date(pebble.createdAt) })}
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}
