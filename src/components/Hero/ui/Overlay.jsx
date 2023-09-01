import './styles/overlay.css'
import { Logo } from './Logo'
import { usePebblesStore } from '../store'
import { Button } from './Button'

import { motion, AnimatePresence } from 'framer-motion'

export const Overlay = () => {
  const handleStart = () => {
    usePebblesStore.getState().setHasStarted(true)
  }

  const handleEnd = () => {
    usePebblesStore.getState().setHasStarted(false)
    usePebblesStore.getState().setHasDetails(false)
    usePebblesStore.getState().setHasCreate(false)
    usePebblesStore.getState().setSelected(null)
  }

  const handleCreate = () => {
    usePebblesStore.getState().setHasDetails(false)
    usePebblesStore.getState().setHasStarted(true)
    usePebblesStore.getState().setHasCreate(true)
  }

  const hasStarted = usePebblesStore((state) => state.hasStarted)

  return (
    <div className={`overlay ${hasStarted && 'experience-start'}`}>
      <div className="overlay__border"></div>
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            className="overlay__intro-wrapper"
            initial={{ opacity: 0, x: '-50%', y: '-4rem', scale: 0.85 }}
            animate={{ opacity: 1, x: '-50%', y: '0rem', scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: '-4rem', scale: 0.85 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <div className="overlay__intro">
              This memorial is bridging stories and memories of victims and survivors of the Shoah.
            </div>
            <div className="overlay__actions">
              <Button text="Explore" variant="dark" onClick={handleStart} />
              <Button text="Create Pebble" variant="light" onClick={handleCreate} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hasStarted && (
          <motion.div
            className="overlay__experience-wrapper"
            initial={{ opacity: 0, x: '-50%', y: '2rem', scale: 0.85 }}
            animate={{ opacity: 1, x: '-50%', y: '0rem', scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: '2rem', scale: 0.85 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <div className="overlay__actions">
              <Button text="Read Biographies" variant="dark" onClick={handleEnd} />
              <Button text="Create Pebble" variant="light" onClick={handleCreate} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`overlay__logo ${hasStarted && 'overlay__logo_collapsed'}`}>
        <Logo />
      </div>
    </div>
  )
}
