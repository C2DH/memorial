import { create } from 'zustand'
import { getGpuNoise } from './helpers/gpuNoise'
import * as c from './sceneConfig'

import { randomChoice, randomChoiceExcluding, randomEuler, lastPebble } from './helpers/utils'

const createNewPebble = (userName, color, lastPositionX, lastPositionZ) => {
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
    linkedBioId: randomChoice([0, 1, 2, 3, 4, 5, 6]),
  }
}

export const usePebblesStore = create((set, get) => ({
  pebblesData: [],
  // UI STATES:
  hasStarted: false,
  hasCreate: false,
  hasDetails: false,
  userInteracted: false,
  // PEBBLE STATES:
  selectedPebble: null,
  lastSelectedPebble: null,
  lastPebbleData: {
    positionX: 0,
    positionZ: 0,
  },
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

    if (currentIndex === -1) {
      console.error('Selected pebble not found in pebblesData.')
      return
    }

    const nextIndex = currentIndex + step

    // Ensure the next index is within the bounds of the pebbles array
    if (nextIndex < 0 || nextIndex >= currentPebbles.length) {
      console.warn('No adjacent pebble in the desired direction.')
      return
    }

    const nextPebble = currentPebbles[nextIndex]
    set({
      selectedPebble: nextPebble,
      userInteracted: true,
    })
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
  setUserInteracted: (value) => set({ userInteracted: value }),
  setHasStarted: (value) => set({ hasStarted: value }),
  setHasDetails: (value) => set({ hasDetails: value }),
  setHasCreate: (value) => set({ hasCreate: value }),
  createPebble: (userName, color, isNew = true) => {
    const newPebbles = get().pebblesData

    const { x, z } = lastPebble(newPebbles)

    const newPebbleData = createNewPebble(userName, color, x, z - c.pebblesOffsetZ)

    newPebbles.push(newPebbleData)

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
      const randomColor = randomChoice([0, 1, 2, 3])
      const randomNickname =
        randomChoice(['Visitor', '', 'Anna', 'John', 'Annonymous', 'Kate', 'Alex']) +
        ' ' +
        randomChoice(['Viena', 'El', '', 'Uni'])
      const newPebble = createNewPebble(randomNickname, randomColor, 0, i * 10)
      newPebbles.push(newPebble)
    }
    set({ pebblesData: newPebbles })
  },
}))
