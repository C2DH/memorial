import { create } from 'zustand'
import { getGpuNoise } from './helpers/gpuNoise'
import {
  randomChoice,
  randomChoiceExcluding,
  randomEuler,
  randomScale,
  randomDate,
} from './helpers/utils'
import * as c from './sceneConfig'

const generateInitialData = (lastPosZ, lastXPos, count) => {
  let initialData = []

  for (let i = 0; i < count; i++) {
    let currentChunkIndex = Math.floor(lastPosZ / c.chunkSize)

    if (!initialData[currentChunkIndex]) {
      initialData[currentChunkIndex] = []
    }

    let xPos = randomChoiceExcluding([-18, -12, -6, 6, 0, 12, 18], lastXPos)
    lastXPos = xPos

    let zPos = lastPosZ
    let yPosVec = {
      x: ((xPos + c.sceneRadius) / c.sceneLoopLength) * c.terrainFrequency,
      y: ((zPos + c.sceneRadius) / c.sceneLoopLength) * c.terrainFrequency,
    }
    let yPos = getGpuNoise(yPosVec) * c.terrainAmplitude

    let item = {
      position: [xPos, yPos, zPos],
      rotation: randomEuler(),
      scale: randomScale(),
      color: randomChoice(c.ghibliPalette),
      uid: lastPosZ,
      created: randomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
      by: 'nickname',
      linkedBioId: randomChoice([0, 1, 2, 3, 4, 5, 6]),
    }

    initialData[currentChunkIndex].push(item)
    lastPosZ += c.pebblesOffsetZ
  }

  return initialData
}

const createNewPebble = (nickname, color, lastPosZ, lastXPos) => {
  let xPos = randomChoiceExcluding([-18, -12, -6, 6, 0, 12, 18], lastXPos)
  let zPos = lastPosZ
  let yPosVec = {
    x: ((xPos + c.sceneRadius) / c.sceneLoopLength) * c.terrainFrequency,
    y: ((zPos + c.sceneRadius) / c.sceneLoopLength) * c.terrainFrequency,
  }
  let yPos = getGpuNoise(yPosVec) * c.terrainAmplitude

  return {
    position: [xPos, yPos, zPos],
    rotation: randomEuler(),
    scale: randomScale(),
    color: c.ghibliPalette[color],
    uid: lastPosZ,
    created: new Date(),
    by: nickname,
    linkedBioId: randomChoice([0, 1, 2, 3, 4, 5, 6]),
  }
}

export const usePebblesStore = create((set, get) => ({
  hasStarted: false,
  hasCreate: false,
  hasDetails: false,
  pebblesData: [],
  selected: null,
  selectedPos: null,
  pebbleLastPosZ: 0,
  pebbleLastXPos: null,
  pebblesCount: 0,
  /* setters */
  setSelected: (uid, position) => set({ selected: uid, selectedPos: position }),
  setHasStarted: (value) => set({ hasStarted: value }),
  setHasDetails: (value) => set({ hasDetails: value }),
  setHasCreate: (value) => set({ hasCreate: value }),
  setInitialData: () => {
    const currentState = get()
    const initialData = generateInitialData(
      currentState.pebbleLastPosZ,
      currentState.pebbleLastXPos,
      2048,
    )
    set((state) => ({
      pebblesData: initialData,
    }))
  },
  createPebble: (nickname, color) => {
    const currentState = get()
    const newPebble = createNewPebble(
      nickname,
      color,
      currentState.pebbleLastPosZ,
      currentState.pebbleLastXPos,
    )
    const currentChunkIndex = Math.floor(currentState.pebbleLastPosZ / c.chunkSize)
    if (!currentState.pebblesData[currentChunkIndex]) {
      currentState.pebblesData[currentChunkIndex] = []
    }
    currentState.pebblesData[currentChunkIndex].push(newPebble)
    set((state) => ({
      pebblesData: currentState.pebblesData,
      pebbleLastPosZ: state.pebbleLastPosZ + c.pebblesOffsetZ,
      pebblesCount: state.pebblesCount + 1,
      hasCreate: false,
      selected: 0,
      selectedPos: newPebble.position,
      hasDetails: true,
    }))
  },
}))

export const useScrollStore = create((set) => ({
  scroll: 0,
  setScroll: (value) => set({ scroll: value }),
}))
