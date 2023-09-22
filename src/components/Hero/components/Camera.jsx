import { useEffect, useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import useSafeFrame from '../hooks/useSafeFrame'

import * as c from '../sceneConfig'

import { usePebblesStore } from '../store'
import { useScrollStore } from '../store'

export const Camera = () => {
  const cameraRef = useRef()

  const forwardPositionRef = useRef(new THREE.Vector3(0, 8, 0))
  const forwardLookAtRef = useRef(new THREE.Vector3(0, 8, 48))
  const targetPositionRef = useRef(new THREE.Vector3(0, 8, 0))
  const targetLookAtRef = useRef(new THREE.Vector3(0, 8, 48))
  const currentPositionRef = useRef(new THREE.Vector3(0, 8, 0))
  const currentLookAtRef = useRef(new THREE.Vector3(0, 8, 48))

  const selectedTarget = usePebblesStore((state) => state.selectedPebble)
  const hasStarted = usePebblesStore((state) => state.hasStarted)

  const CAMERA_OFFSET = [-12, 8, -12]
  const TARGET_OFFSET = [-2, 0, 4]

  const moveCameraOnScroll = () => {
    const scrollProgress = useScrollStore.getState().scroll
    forwardPositionRef.current.z = scrollProgress * 20
  }

  const setCameraPosZ = () => {
    forwardLookAtRef.current.z = targetPositionRef.current.z + c.sceneRadius
  }

  const setCameraForward = () => {
    targetPositionRef.current.set(...forwardPositionRef.current)
    targetLookAtRef.current.set(...forwardLookAtRef.current)
  }

  const setCameraToTarget = () => {
    targetPositionRef.current.set(
      selectedTarget.position[0] + CAMERA_OFFSET[0],
      selectedTarget.position[1] + CAMERA_OFFSET[1],
      selectedTarget.position[2] + CAMERA_OFFSET[2] + c.sceneOffsetZ,
    )
    targetLookAtRef.current.set(
      selectedTarget.position[0] + TARGET_OFFSET[0],
      selectedTarget.position[1] + TARGET_OFFSET[1],
      selectedTarget.position[2] + TARGET_OFFSET[2] + c.sceneOffsetZ,
    )
  }

  const updateCamera = (delta) => {
    currentPositionRef.current.lerp(targetPositionRef.current, 1.6 * delta)
    currentLookAtRef.current.lerp(targetLookAtRef.current, 1.6 * delta)

    if (cameraRef.current) {
      cameraRef.current.position.set(...currentPositionRef.current)
      cameraRef.current.lookAt(currentLookAtRef.current)
      cameraRef.current.updateProjectionMatrix()
    }
  }

  // eslint-disable-next-line no-unused-vars
  const spinCamera = () => {
    const time = Date.now() * 0.001
    const radius = 32
    const angle = time * 0.1
    const x = Math.cos(Math.PI / 2 + angle) * radius
    const z = -Math.sin(Math.PI / 2 + angle) * radius

    targetPositionRef.current.set(x, 16, z)
    targetLookAtRef.current.set(0, 16, 0)
  }

  const oscilateCamera = () => {
    const time = Date.now() * 0.001
    const y = Math.sin(time * 0.5) * 4 + 12
    targetPositionRef.current.set(0, y, -12)
    targetLookAtRef.current.set(0, 4, 48)
  }

  useSafeFrame((_, delta) => {
    if (!hasStarted) {
      oscilateCamera()
    } else if (hasStarted && selectedTarget) {
      setCameraToTarget()
      setCameraPosZ()
    } else if (hasStarted && !selectedTarget) {
      moveCameraOnScroll()
      setCameraForward()
      setCameraPosZ()
    }
    updateCamera(delta)
  })

  useEffect(() => {
    const currentCamera = cameraRef.current
    if (!currentCamera) return

    currentCamera.position.set(...forwardPositionRef.current.toArray())
    currentCamera.lookAt(...forwardLookAtRef.current.toArray())
    currentCamera.zoom = 0.75
    currentCamera.updateProjectionMatrix()
  }, [])

  return <PerspectiveCamera ref={cameraRef} makeDefault />
}
