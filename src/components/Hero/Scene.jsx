import { useRef } from 'react'

import { Grass } from './components/Grass'
import { Terrain } from './components/Terrain'
import { Sky } from './components/Sky'
import { Pebbles } from './components/Pebbles'

import * as THREE from 'three'

import { useRenderedTexture } from './hooks/useRenderedTexture'

import * as c from './sceneConfig'

export const Scene = () => {
  const skyColor = useRef(new THREE.Color(c.skyColor))
  const groundColor = useRef(new THREE.Color(c.groundColor))

  const { renderedTexture, portal } = useRenderedTexture()

  return (
    <>
      {portal}

      <Sky renderedTexture={renderedTexture} skyColor={skyColor} groundColor={groundColor} />
      <Grass renderedTexture={renderedTexture} skyColor={skyColor} groundColor={groundColor} />
      <Terrain renderedTexture={renderedTexture} skyColor={skyColor} groundColor={groundColor} />
      <Pebbles renderedTexture={renderedTexture} skyColor={skyColor} groundColor={groundColor} />
    </>
  )
}
