import './styles/overlay.css'
import { Logo } from './Logo'
import { usePebblesStore } from '../store'
import { Button } from './Button'

import { motion, AnimatePresence } from 'framer-motion'

import { Logotypes } from './Logotypes'

import LogoFondLuxShoah from '../../../assets/images/fondluxshoah-logo.png'

export const Overlay = ({ isMobile }) => {
  const handleStart = () => {
    usePebblesStore.getState().setHasStarted(true)
    usePebblesStore.getState().selectAdjacentPebble(0)
    usePebblesStore.getState().setHasDetails(true)
    usePebblesStore.getState().setUserInteracted(false)
  }

  const handleEnd = () => {
    usePebblesStore.getState().setHasStarted(false)
    usePebblesStore.getState().setHasDetails(false)
    usePebblesStore.getState().setHasCreate(false)
  }

  const handleCreate = () => {
    usePebblesStore.getState().setHasDetails(false)
    usePebblesStore.getState().setHasStarted(true)
    usePebblesStore.getState().setHasCreate(true)
  }

  const hasStarted = usePebblesStore((state) => state.hasStarted)

  return (
    <div className={`overlay ${hasStarted && 'experience-start'}`}>
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            className="overlay__intro-wrapper"
            initial={{ opacity: 1, x: '-50%', y: '-4rem', scale: 0.85 }}
            animate={{ opacity: 1, x: '-50%', y: '0rem', scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: '-4rem', scale: 0.85 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <div className="overlay__intro">
              This memorial is bridging stories and memories of victims and survivors of the Shoah.
            </div>
            <div className="overlay__text">
              The Memorial defines itself as a participatory work in progress, with the aim of
              writing together the biographies of the families of some 5,000 people who lived in
              Luxembourg before the war and who were persecuted for racial reasons before and during
              Second World War.
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
            <div className="overlay__intro_exp">
              This memorial is bridging stories and memories of victims and survivors of the Shoah.
            </div>
            <div className="overlay__actions">
              <Button text="About" variant="dark" onClick={handleEnd} />
              <Button text="Create Pebble" variant="light" onClick={handleCreate} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overlay__copy">
        <p>Copyright © Université du Luxembourg 2023. All rights reserved.</p>
      </div>
      {!isMobile && (
        <div className={`overlay__logo ${hasStarted && 'overlay__logo_collapsed'}`}>
          <Logo />
        </div>
      )}
      <div className={`overlay__logos ${hasStarted && 'overlay__logos_collapsed'}`}>
        <Logotypes />
      </div>
      <div className={`overlay__logo_soah ${hasStarted && 'overlay__logo_soah_collapsed'}`}>
        <div>
          <a
            href="https://fondluxshoah.lu/"
            target="_blank"
            title="Fondation luxembourgeoise pour la Mémoire de la Shoah"
            rel="noreferrer"
            className="ms-3"
          >
            <img
              src={LogoFondLuxShoah}
              style={{ height: 75 }}
              alt="Logo Fondation luxembourgeoise pour la Mémoire de la Shoah"
            />
          </a>
        </div>
      </div>
    </div>
  )
}
