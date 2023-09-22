import * as c from '../sceneConfig'

export const randomChoice = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

export const randomChoiceExcluding = (choices, exclude) => {
  const filteredChoices = choices.filter((item) => item !== exclude)
  return randomChoice(filteredChoices)
}

export const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  ).toLocaleString('en-us', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export const randomEuler = () => {
  return [Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI]
}

export const randomScale = () => {
  return [1.0 + Math.random() * 0.25, 1.0 + Math.random() * 0.25, 1.0 + Math.random() * 0.25]
}

export const getCurrentChunkIndex = (positionZ) => {
  return Math.floor(positionZ / c.chunkSize)
}
