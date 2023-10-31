import { create } from 'zustand'
import { getGpuNoise } from './helpers/gpuNoise'
import * as c from './sceneConfig'
import * as THREE from 'three'

import { randomChoice, randomChoiceExcluding, randomEuler, lastPebble } from './helpers/utils'

const createNewPebble = (userName, color, bioId, lastPositionX, lastPositionZ) => {
  let positionX = randomChoiceExcluding([-18, -12, -6, 6, 0, 12, 18], lastPositionX)
  let positionZ = lastPositionZ

  let vectorXZ = {
    x: ((positionX + c.sceneRadius) / c.sceneLoopLength) * c.terrainFrequency,
    y: ((positionZ + c.sceneRadius) / c.sceneLoopLength) * c.terrainFrequency,
  }

  let positionY = getGpuNoise(vectorXZ) * c.terrainAmplitude

  return {
    position: [positionX, positionY, positionZ],
    rotation: randomEuler(),
    scale: [1, 1, 1],
    color: c.ghibliPalette[color],
    uid: lastPositionZ,
    createdAt: new Date(),
    createdBy: userName,
    linkedBioId: bioId,
  }
}

export const usePebblesStore = create((set, get) => ({
  pebblesData: [],
  // UI STATES:
  hasStarted: false,
  hasCreate: false,
  hasDetails: false,
  userInteracted: false,
  currentStory: null,
  // PEBBLE STATES:
  selectedPebble: null,
  lastSelectedPebble: null,
  lastPebbleData: {
    positionX: 0,
    positionZ: 0,
  },
  // CAMERA STATES:
  cameraPosition: new THREE.Vector3(0, 8, 0),
  cameraLookAt: new THREE.Vector3(0, 8, 48),
  // ACTIONS:
  selectAdjacentPebble: (step) => {
    const currentPebbles = get().pebblesData
    const currentSelectedPebble = get().selectedPebble

    if (!currentSelectedPebble) {
      set({
        selectedPebble: currentPebbles[0],
        userInteracted: true,
      })
      return
    }

    const currentIndex = currentPebbles.findIndex(
      (pebble) => pebble.uid === currentSelectedPebble.uid,
    )

    console.warn(currentIndex)

    if (currentIndex === -1) {
      console.error('Selected pebble not found in pebblesData.')
      return
    }

    const nextIndex = currentIndex + step

    if (nextIndex < 0 || nextIndex >= currentPebbles.length) {
      console.warn(currentIndex)
      console.warn('No adjacent pebble in the desired direction.')
      return
    }

    const nextPebble = currentPebbles[nextIndex]
    set({
      selectedPebble: nextPebble,
      userInteracted: true,
    })
  },
  setCameraState: (position, lookAt) => {
    set({
      cameraPosition: position,
      cameraLookAt: lookAt,
    })
  },
  moveCameraToLastPebble: () => {
    const pebbles = get().pebblesData
    if (pebbles.length === 0) {
      console.warn('No pebbles available to move the camera to.')
      return
    }

    const sortedPebbles = [...pebbles].sort((a, b) => a.position[2] - b.position[2])
    const pebbleWithSmallestZ = sortedPebbles[0]

    const newPosition = new THREE.Vector3(
      get().cameraPosition.x,
      get().cameraPosition.y,
      pebbleWithSmallestZ.position[2],
    )

    set({
      cameraPosition: newPosition,
    })
  },
  getCameraState: () => {
    const state = get()
    return {
      position: state.cameraPosition,
      lookAt: state.cameraLookAt,
    }
  },
  setSelected: (data) => {
    set({
      selectedPebble: data,
      lastSelectedPebble: data,
      userInteracted: true,
    })
  },
  resetSelected: () => {
    set({
      selectedPebble: null,
      userInteracted: true,
    })
  },
  setCurrentStory: (data) => {
    set({
      currentStory: data,
    })
  },
  selectLastPebble: () => {
    const pebbles = get().pebblesData
    if (pebbles.length === 0) {
      console.warn('No pebbles available to select.')
      return
    }

    const sortedPebbles = [...pebbles].sort((a, b) => a.position[2] - b.position[2])

    const pebbleWithSmallestZ = sortedPebbles[0]

    set({
      selectedPebble: pebbleWithSmallestZ,
      userInteracted: true,
    })
  },

  setUserInteracted: (value) => set({ userInteracted: value }),
  setHasStarted: (value) => set({ hasStarted: value }),
  setHasDetails: (value) => set({ hasDetails: value }),
  setHasCreate: (value) => set({ hasCreate: value }),
  createPebble: (userName, color, bioId, isNew = true) => {
    const newPebbles = get().pebblesData

    const { x, z } = lastPebble(newPebbles)

    const newPebbleData = createNewPebble(userName, color, bioId, x, z - c.pebblesOffsetZ)

    newPebbles.unshift(newPebbleData)

    const myPebbles = JSON.parse(localStorage.getItem('myPebbles')) || []
    myPebbles.push(newPebbleData.uid)
    localStorage.setItem('myPebbles', JSON.stringify(myPebbles))

    set(() => ({
      pebblesData: newPebbles,
      selectedPebble: isNew ? newPebbleData : null,
      hasCreate: false,
      hasDetails: isNew ? true : false,
    }))
  },
  setInitialData: () => {
    const newPebbles = []
    for (let i = 0; i < 128; i++) {
      const randomColor = randomChoice([0, 1, 2, 3, 4])
      const randomBio = randomChoice([64, 71, 73, 75])
      const randomNickname =
        randomChoice(['Visitor', 'Anna', 'John', 'Annonymous', 'Kate', 'Alex']) +
        ' ' +
        randomChoice(['Viena', 'El', 'Uni'])
      const newPebble = createNewPebble(randomNickname, randomColor, randomBio, 0, i * 10)
      newPebbles.push(newPebble)
    }
    set({ pebblesData: newPebbles })
  },
}))
