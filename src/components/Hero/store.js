import { create } from 'zustand'
import { getGpuNoise } from './helpers/gpuNoise'
import * as c from './sceneConfig'
import * as THREE from 'three'
import axios from 'axios'

import { randomChoiceExcluding, randomEuler, lastPebble } from './helpers/utils'

export const createNewPebble = (userName, message, color, bioId, lastPositionX, lastPositionZ) => {
  let positionX = randomChoiceExcluding([-18, -12, -6, 6, 0, 12, 18], lastPositionX)
  let positionZ = lastPositionZ - c.pebblesOffsetZ

  let vectorXZ = {
    x: ((positionX + c.sceneRadius) / c.sceneLoopLength) * c.terrainFrequency,
    y: ((positionZ + c.sceneRadius) / c.sceneLoopLength) * c.terrainFrequency,
  }

  let positionY = getGpuNoise(vectorXZ) * c.terrainAmplitude

  return {
    position: [positionX, positionY, positionZ],
    rotation: randomEuler(),
    scale: [1, 1, 1],
    color: color,
    uid: lastPositionZ,
    createdAt: new Date(),
    createdBy: userName,
    message: message,
    linkedBioId: bioId,
  }
}

export const usePebblesStore = create((set, get) => ({
  pebblesData: [],
  // default Z extents of the pebbles
  pebblesExtent: [-100, 0],
  // UI STATES:
  hasStarted: false,
  hasCreate: false,
  hasDetails: false,
  userInteracted: false,
  currentStory: null,
  // PEBBLE STATES:
  z: null,
  lastSelectedPebble: null,
  lastPebbleData: {
    positionX: 0,
    positionZ: 0,
  },
  // confirmation modal hide/show
  showConfirmationModal: false,
  setShowConfirmationModal: (value) => set({ showConfirmationModal: value }),
  // info modal hide/show
  showInfoModal: false,
  setShowInfoModal: (value) => set({ showInfoModal: value }),
  // CAMERA STATES:
  cameraPosition: new THREE.Vector3(0, 8, 0),
  cameraLookAt: new THREE.Vector3(0, 8, 48),
  // ACTIONS:
  isFirstPebble: () => {
    const pebbles = get().pebblesData
    const selectedPebble = get().selectedPebble
    return pebbles.indexOf(selectedPebble) === 0
  },
  isLastPebble: () => {
    const pebbles = get().pebblesData
    const selectedPebble = get().selectedPebble
    return pebbles.indexOf(selectedPebble) === pebbles.length - 1
  },
  selectAdjacentPebble: (step) => {
    const currentPebbles = get().pebblesData
    const currentSelectedPebble = get().selectedPebble

    if (currentPebbles.length === 0) {
      console.warn('No pebbles available to select.')
      return
    }

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
  createPebble: (newPebbleData, isNew = true) => {
    const newPebbles = get().pebblesData

    newPebbles.unshift(newPebbleData)

    const myPebbles = JSON.parse(localStorage.getItem('myPebbles')) || []
    myPebbles.push(newPebbleData.uid)
    localStorage.setItem('myPebbles', JSON.stringify(myPebbles))

    set(() => ({
      pebblesData: newPebbles,
      selectedPebble: isNew ? newPebbleData : null,
      lastPebbleData: lastPebble(newPebbles),
      hasCreate: false,
      hasDetails: isNew ? true : false,
    }))
  },
  setInitialData: async () => {
    try {
      const response = await axios.get('/api/pebbles/')
      const apiPebbles = response.data.results

      const newPebbles = apiPebbles.map((apiPebble) => {
        return {
          position: apiPebble.position,
          rotation: apiPebble.rotation,
          scale: apiPebble.scale,
          status: apiPebble.status,
          uid: apiPebble.shortUrl,
          createdAt: new Date(apiPebble.createdAt),
          createdBy: apiPebble.createdBy,
          linkedBioId: apiPebble.linkedBioId,
          message: apiPebble.message,
          color: apiPebble.color,
        }
      })
      set({ pebblesData: newPebbles, lastPebbleData: lastPebble(newPebbles) })
    } catch (error) {
      console.error('Error fetching pebbles data:', error)
    }
  },
  playDemo: false,
  setPlayDemo: (value) => set({ playDemo: value }),
}))
