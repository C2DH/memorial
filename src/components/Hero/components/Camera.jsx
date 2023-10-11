import { useEffect, useRef, useState } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

import { usePebblesStore } from '../store'

import * as c from '../sceneConfig'

const CAMERA_OFFSET = [-12, 10, -12]
const TARGET_OFFSET = [-2, 6, 4]

export const Camera = () => {
  const cameraRef = useRef()

  const forwardPositionRef = useRef(new THREE.Vector3(0, 8, 0))
  const forwardLookAtRef = useRef(new THREE.Vector3(0, 8, 48))
  const targetPositionRef = useRef(new THREE.Vector3(0, 8, 0))
  const targetLookAtRef = useRef(new THREE.Vector3(0, 8, 48))
  const currentPositionRef = useRef(new THREE.Vector3(0, 8, 0))
  const currentLookAtRef = useRef(new THREE.Vector3(0, 8, 48))

  const mousePosition = useRef({ x: 0, y: 0 })

  const scrollSpeedRef = useRef(0)

  let lastScrollTime = useRef(Date.now()).current
  let accumulatedDelta = useRef(0).current
  let lastTouchY = useRef(0).current

  const selectedTarget = usePebblesStore((state) => state.selectedPebble)
  const hasStarted = usePebblesStore((state) => state.hasStarted)

  const [signedPosition, setSignedPosition] = useState(1)

  useEffect(() => {
    selectedTarget && setSignedPosition((prev) => -prev)
  }, [selectedTarget])

  const handleScroll = (e) => {
    const currentTime = Date.now()
    const elapsedTime = currentTime - lastScrollTime
    lastScrollTime = currentTime

    const normalized = Math.sign(e.wheelDelta ? e.wheelDelta : -e.deltaY)

    accumulatedDelta += normalized

    if (Math.abs(accumulatedDelta) > 2 || elapsedTime > 200) {
      scrollSpeedRef.current = calculateSpeed(accumulatedDelta, elapsedTime)
      accumulatedDelta = 0
    }
  }

  const handleTouchStart = (e) => {
    console.log('touch start')
    lastTouchY = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    e.preventDefault()

    const deltaY = lastTouchY - e.touches[0].clientY
    lastTouchY = e.touches[0].clientY
    accumulatedDelta += deltaY

    const currentTime = Date.now()
    const elapsedTime = currentTime - lastScrollTime
    lastScrollTime = currentTime

    if (Math.abs(accumulatedDelta) > 2 || elapsedTime > 200) {
      scrollSpeedRef.current = calculateSpeed(accumulatedDelta, elapsedTime)
      accumulatedDelta = 0
    }
  }

  const handleMouseMove = (event) => {
    mousePosition.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    }
  }

  useEffect(() => {
    window.addEventListener('wheel', handleScroll)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  })

  const calculateSpeed = (delta, time) => {
    return THREE.MathUtils.clamp((delta / time) * 1000, -2, 2)
  }

  const cameraScroll = (delta) => {
    targetPositionRef.current.z += scrollSpeedRef.current * delta * -50
    targetLookAtRef.current.z += scrollSpeedRef.current * delta * -50
    scrollSpeedRef.current *= 1 - delta * 5
    if (Math.abs(scrollSpeedRef.current) < 0.01) {
      scrollSpeedRef.current = 0
    }
  }

  const cameraToTarget = () => {
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

  const oscilateCamera = () => {
    const lastTarget = usePebblesStore.getState().lastSelectedPebble

    targetPositionRef.current.y = lastTarget ? lastTarget.position[1] + 48 : 48

    targetLookAtRef.current.x = 0
    targetLookAtRef.current.y = 40
    targetLookAtRef.current.z = targetPositionRef.current.z + 48
  }

  const updateCamera = (delta) => {
    currentPositionRef.current.lerp(targetPositionRef.current, 1.25 * delta)
    currentLookAtRef.current.lerp(targetLookAtRef.current, 1.25 * delta)

    currentLookAtRef.current.x += !selectedTarget ? mousePosition.current.x * -0.15 : 0
    currentLookAtRef.current.y += hasStarted ? mousePosition.current.y * 0.05 : 0

    cameraRef.current.position.set(...currentPositionRef.current)
    cameraRef.current.lookAt(currentLookAtRef.current)
    cameraRef.current.updateProjectionMatrix()
  }

  const cameraForward = () => {
    targetPositionRef.current.x = 0

    targetLookAtRef.current.x = 0
    targetLookAtRef.current.y = 8
    targetLookAtRef.current.z = targetPositionRef.current.z + 48
  }

  useEffect(() => {
    const currentCamera = cameraRef.current
    if (!currentCamera) return

    currentCamera.position.set(...forwardPositionRef.current.toArray())
    currentCamera.lookAt(...forwardLookAtRef.current.toArray())
    currentCamera.zoom = 1
    currentCamera.updateProjectionMatrix()
  }, [])

  useFrame((_, delta) => {
    if (!cameraRef.current) return

    if (hasStarted) {
      if (selectedTarget) {
        cameraToTarget()
      } else {
        cameraForward()
      }
      cameraScroll(delta)
    } else {
      oscilateCamera()
    }

    updateCamera(delta)
  })

  return <PerspectiveCamera ref={cameraRef} makeDefault />
}
