import { create } from 'zustand'
import * as THREE from 'three'
import { getGpuNoise } from './helpers/gpuNoise'

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  ).toLocaleString('en-us', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function randomEuler() {
  return [Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI]
}

function randomScale() {
  return [0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5]
}

const ghibliPalette = [
  new THREE.Color(0x87c0a5), // Soft Green
  new THREE.Color(0xffdac1), // Soft Peach
  new THREE.Color(0x55cbcd), // Turquoise
  new THREE.Color(0xff9b85), // Coral Pink
  new THREE.Color(0x908170), // Earthy Brown
]

let pos = 0
let data = []

for (let i = 0; i < 512; i++) {
  let xPos = randomChoice([-18, -12, -6, 6, 12, 18])
  let zPos = pos

  let yPosVec = { x: ((xPos + 48) / 96) * 4, y: ((zPos + 48) / 96) * 4 }
  let yPos = getGpuNoise(yPosVec)

  let item = {
    position: [xPos, yPos * 6, zPos],
    rotation: randomEuler(),
    scale: randomScale(),
    color: randomChoice(ghibliPalette),
    uid: pos,
    created: randomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
  }
  data.push(item)

  pos += randomChoice([12, 6])
}

export const usePebblesStore = create((set) => ({
  hasStarted: false,
  hasCreate: false,
  selected: null,
  pebblesData: data,
  hasDetails: false,
  selectedPos: null,
  setSelected: (uid, position) => set({ selected: uid, selectedPos: position }),
  setHasStarted: (value) => set({ hasStarted: value }),
  setHasDetails: (value) => set({ hasDetails: value }),
  setHasCreate: (value) => set({ hasCreate: value }),
}))
