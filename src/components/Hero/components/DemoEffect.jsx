import { useEffect, useRef } from 'react'

import PropTypes from 'prop-types'
import { usePebblesStore } from '../store'

const DemoEffect = ({ delay = 5000 }) => {
  const timerRef = useRef(null)
  const internalIndexRef = useRef(-1)
  const pebblesData = usePebblesStore((state) => state.pebblesData)
  const playDemo = usePebblesStore((state) => state.playDemo)
  const setSelected = usePebblesStore((state) => state.setSelected)

  useEffect(() => {
    console.log('[DemoEffect] @useEffect', 'playDemo', playDemo)
    if (!playDemo || !pebblesData.length) return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      internalIndexRef.current = Math.floor(Math.random() * pebblesData.length)
      console.log(
        '[DemoEffect]',
        'setInterval at:',
        internalIndexRef.current,
        pebblesData[internalIndexRef.current],
      )
      setSelected(pebblesData[internalIndexRef.current])
    }, delay)
    console.log('[DemoEffect]', 'delay:', delay)
    return () => {
      console.log('[DemoEffect] cleanup')
      clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, pebblesData, playDemo])
  return null
}

DemoEffect.propTypes = {
  delay: PropTypes.number,
}

export default DemoEffect
