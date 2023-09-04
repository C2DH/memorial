import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame, createPortal } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'

import vertex from '../shaders/compute.vert'
import fragment from '../shaders/compute.frag'

import * as c from '../sceneConfig'

export const useRenderedTexture = () => {
  const otherScene = useRef(new THREE.Scene())
  const mainCamera = useRef(new THREE.Vector3(0, 0, 0))

  const renderTarget = useRef(
    useFBO(256, 256, {
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      type: THREE.FloatType,
    }),
  )

  useFrame(({ camera }) => {
    mainCamera.current.set(...camera.position)
  })

  return {
    renderedTexture: renderTarget.current.texture,
    portal: createPortal(
      <Container
        renderTarget={renderTarget.current}
        otherScene={otherScene.current}
        cameraPosition={mainCamera.current}
      />,
      otherScene.current,
    ),
  }
}

function Container({ renderTarget, otherScene, cameraPosition }) {
  const shaderRef = useRef()

  const targetCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1),
    [],
  )

  const uniforms = useMemo(
    () => ({
      time: { value: 0.0 },
      cam: { value: new THREE.Vector3(0, 0, 0) },
      terrainAmplitude: { value: c.terrainAmplitude },
      terrainFrequency: { value: c.terrainFrequency },
      sceneLoopLength: { value: c.sceneLoopLength },
    }),
    [],
  )

  useFrame(({ gl, clock }) => {
    uniforms.time.value = clock.elapsedTime
    uniforms.cam.value = cameraPosition
    gl.setRenderTarget(renderTarget)
    gl.clear()
    gl.render(otherScene, targetCamera)
    gl.setRenderTarget(null)
  })

  return (
    <mesh>
      <planeGeometry args={[2.0, 2.0]} />
      <rawShaderMaterial
        ref={shaderRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  )
}
