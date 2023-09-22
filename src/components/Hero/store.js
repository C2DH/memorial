import { create } from 'zustand'
import { getGpuNoise } from './helpers/gpuNoise'
import * as c from './sceneConfig'

import {
  randomChoice,
  randomChoiceExcluding,
  randomEuler,
  getCurrentChunkIndex as getChunkIndex,
} from './helpers/utils'

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

const insertNewPebble = (pebble, pebbles, chunkIndex) => {
  if (!pebbles[chunkIndex]) {
    pebbles[chunkIndex] = []
  }

  pebbles[chunkIndex].push(pebble)
}

export const usePebblesStore = create((set, get) => ({
  pebblesData: [],
  // UI STATES:
  hasStarted: false,
  hasCreate: false,
  hasDetails: false,
  // PEBBLE STATES:
  selectedPebble: null,
  pebblesCount: 0,
  lastPebbleData: {
    positionX: 0,
    positionZ: 0,
  },
  // ACTIONS:
  setSelected: (data) => {
    set({ selectedPebble: data })
  },
  setHasStarted: (value) => set({ hasStarted: value }),
  setHasDetails: (value) => set({ hasDetails: value }),
  setHasCreate: (value) => set({ hasCreate: value }),
  createPebble: (userName, color, isNew = true) => {
    const newPebbles = get().pebblesData
    const lastPebbleData = get().lastPebbleData
    const currentChunkIndex = getChunkIndex(lastPebbleData.positionZ)

    const newPebbleData = createNewPebble(
      userName,
      color,
      lastPebbleData.positionX,
      lastPebbleData.positionZ,
    )

    insertNewPebble(newPebbleData, newPebbles, currentChunkIndex)

    set((state) => ({
      pebblesData: newPebbles,
      pebblesCount: state.pebblesCount + 1,
      lastPebbleData: {
        positionX: newPebbleData.position[0],
        positionZ: state.lastPebbleData.positionZ + c.pebblesOffsetZ,
      },
      selectedPebble: isNew ? newPebbleData : null,
      hasCreate: false,
      hasDetails: isNew ? true : false,
    }))
  },
  setInitialData: () => {
    console.log('setInitialData')
    for (let i = 0; i < 4; i++) {
      const randomColor = randomChoice([0, 1, 2, 3])
      const randomNickname = 'username' + randomChoice([0, 1, 2, 3, 4])
      get().createPebble(randomNickname, randomColor, false)
    }
  },
}))

export const useScrollStore = create((set) => ({
  scroll: 0,
  setScroll: (value) => set({ scroll: value }),
}))
