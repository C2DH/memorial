import { useEffect, useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import useSafeFrame from '../hooks/useSafeFrame'

import { usePebblesStore } from '../store'

export const Camera = () => {
  const cameraRef = useRef()

  const forwardPositionRef = useRef(new THREE.Vector3(0, 8, 0))
  const forwardLookAtRef = useRef(new THREE.Vector3(0, 8, 48))
  const targetPositionRef = useRef(new THREE.Vector3(0, 8, 0))
  const targetLookAtRef = useRef(new THREE.Vector3(0, 8, 48))
  const currentPositionRef = useRef(new THREE.Vector3(0, 8, 0))
  const currentLookAtRef = useRef(new THREE.Vector3(0, 8, 48))

  const selectedPos = usePebblesStore((state) => state.selectedPos)
  const hasStarted = usePebblesStore((state) => state.hasStarted)

  const CAMERA_OFFSET = [-12, 8, -12]
  const TARGET_OFFSET = [-2, 0, 4]

  const moveCameraOnScroll = (event) => {
    if (selectedPos === null) {
      event.preventDefault()
      const delta = Math.sign(event.deltaY)
      forwardPositionRef.current.z += delta * 2
    }
  }

  const setCameraPosZ = () => {
    forwardLookAtRef.current.z = targetPositionRef.current.z + 48
  }

  const setCameraForward = () => {
    targetPositionRef.current.set(...forwardPositionRef.current)
    targetLookAtRef.current.set(...forwardLookAtRef.current)
  }

  const setCameraToTarget = () => {
    targetPositionRef.current.set(
      selectedPos[0] + CAMERA_OFFSET[0],
      selectedPos[1] + CAMERA_OFFSET[1],
      selectedPos[2] + CAMERA_OFFSET[2],
    )
    targetLookAtRef.current.set(
      selectedPos[0] + TARGET_OFFSET[0],
      selectedPos[1] + TARGET_OFFSET[1],
      selectedPos[2] + TARGET_OFFSET[2],
    )
  }

  const updateCamera = () => {
    currentPositionRef.current.lerp(targetPositionRef.current, 0.1)
    currentLookAtRef.current.lerp(targetLookAtRef.current, 0.1)

    if (cameraRef.current) {
      cameraRef.current.position.set(...currentPositionRef.current)
      cameraRef.current.lookAt(currentLookAtRef.current)
      cameraRef.current.updateProjectionMatrix()
    }
  }

  const spinCamera = () => {
    const time = Date.now() * 0.001
    const radius = 32
    const angle = time * 0.1
    const x = Math.cos(Math.PI / 2 + angle) * radius
    const z = -Math.sin(Math.PI / 2 + angle) * radius

    targetPositionRef.current.set(x, 16, z)
    targetLookAtRef.current.set(0, 16, 0)
  }

  useSafeFrame((state) => {
    if (!hasStarted) {
      spinCamera()
    } else {
      selectedPos ? setCameraToTarget() : setCameraForward()
      setCameraPosZ()
    }
    updateCamera()
  })

  useEffect(() => {
    const currentCamera = cameraRef.current
    if (!currentCamera) return

    currentCamera.position.set(...forwardPositionRef.current.toArray())
    currentCamera.lookAt(...forwardLookAtRef.current.toArray())
    currentCamera.zoom = 0.75
    currentCamera.updateProjectionMatrix()

    window.addEventListener('wheel', moveCameraOnScroll, { passive: false })

    return () => {
      window.removeEventListener('wheel', moveCameraOnScroll)
    }
  }, [])

  return <PerspectiveCamera ref={cameraRef} makeDefault />
}
