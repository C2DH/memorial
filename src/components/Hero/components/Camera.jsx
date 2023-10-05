import { useEffect, useRef, useState } from 'react'
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

  const CAMERA_OFFSET = [-12, 10, -12]
  const TARGET_OFFSET = [-2, 6, 4]

  const [signedPosition, setSignedPosition] = useState(1)

  useEffect(() => {
    selectedTarget && setSignedPosition((prev) => -prev)
  }, [selectedTarget])

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
      selectedTarget.position[0] + CAMERA_OFFSET[0] * signedPosition,
      selectedTarget.position[1] + CAMERA_OFFSET[1],
      selectedTarget.position[2] + CAMERA_OFFSET[2] + c.sceneOffsetZ,
    )
    targetLookAtRef.current.set(
      selectedTarget.position[0] + TARGET_OFFSET[0] * signedPosition,
      selectedTarget.position[1] + TARGET_OFFSET[1],
      selectedTarget.position[2] + TARGET_OFFSET[2] + c.sceneOffsetZ,
    )
  }

  const mousePosition = useRef({ x: 0, y: 0 })

  const handleMouseMove = (event) => {
    mousePosition.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const updateCamera = (delta) => {
    currentPositionRef.current.lerp(targetPositionRef.current, 1.25 * delta)
    currentLookAtRef.current.lerp(targetLookAtRef.current, 1.25 * delta)

    currentLookAtRef.current.x += !selectedTarget ? mousePosition.current.x * -0.15 : 0
    currentLookAtRef.current.y += hasStarted ? mousePosition.current.y * 0.05 : 0

    if (cameraRef.current) {
      cameraRef.current.position.set(...currentPositionRef.current)
      cameraRef.current.lookAt(currentLookAtRef.current)
      cameraRef.current.updateProjectionMatrix()
    }
  }

  // const oscilateCamera = () => {
  //   targetPositionRef.current.y = 48
  //   targetLookAtRef.current.x = 0
  //   targetLookAtRef.current.y = 40
  //   targetLookAtRef.current.z = targetPositionRef.current.z + 48
  // }

  const oscilateCamera = () => {
    const lastTarget = usePebblesStore.getState().lastSelectedPebble

    targetPositionRef.current.x = lastTarget ? lastTarget.position[0] + 0 : 0
    targetPositionRef.current.y = lastTarget ? lastTarget.position[1] + 48 : 48
    targetPositionRef.current.z = lastTarget ? lastTarget.position[2] - 128 : -128
    targetLookAtRef.current.x = 0
    targetLookAtRef.current.y = 32
    targetLookAtRef.current.z = targetPositionRef.current.z + 48
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
    currentCamera.zoom = 1
    currentCamera.updateProjectionMatrix()
  }, [])

  return <PerspectiveCamera ref={cameraRef} makeDefault />
}
