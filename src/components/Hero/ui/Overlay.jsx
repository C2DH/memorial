import './styles/overlay.css'
import { usePebblesStore } from '../store'
import { Button } from './Button'

import { motion, AnimatePresence } from 'framer-motion'

import { Logotypes } from './Logotypes'

import { useTranslation } from 'react-i18next'
import LangLink from '../../LangLink'
import { BiographiesRoute } from '../../../constants'
import ScrollIcon from '../../ScrollIcon'
import { useEffect, useRef } from 'react'
import { FondationLogo } from './FondationLogo'

export const Overlay = ({ isMobile, delay = 1000 }) => {
  const { t } = useTranslation()
  const timerRef = useRef(null)
  const [setHasCreate, setHasStarted, selectAdjacentPebble, setHasDetails, setUserInteracted] =
    usePebblesStore((state) => [
      state.setHasCreate,
      state.setHasStarted,
      state.selectAdjacentPebble,
      state.setHasDetails,
      state.setUserInteracted,
    ])

  const selectedPebble = usePebblesStore((state) => state.selectedPebble)

  const handleStart = () => {
    setHasStarted(true)

    timerRef.current = setTimeout(() => {
      selectAdjacentPebble(0)
    }, delay)
  }

  const handleEnd = () => {
    setHasStarted(false)
    setHasDetails(false)
    setHasCreate(false)
  }

  const hasStarted = usePebblesStore((state) => state.hasStarted)

  useEffect(() => {
    // selectAdjacentPebble(0)
    if (selectedPebble) {
      setHasDetails(true)
      setUserInteracted(false)
    }
  }, [selectedPebble])
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className={`overlay ${hasStarted && 'experience-start'}`}>
      {!isMobile ? <ScrollIcon /> : null}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            className="overlay__intro-wrapper"
            initial={{ opacity: 1, x: '-50%' }}
            animate={{ opacity: 1, x: '-50%' }}
            exit={{ opacity: 0, x: '-50%' }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <div className="overlay__intro">{t('pagesHomeSubheading')}</div>
            <div className="overlay__text">
              <p dangerouslySetInnerHTML={{ __html: t('pagesHomeParagraphA') }}></p>
            </div>
            <div className="overlay__actions">
              <button
                className="GetInTouch btn btn-white btn-lg"
                text="Explore Landscape"
                variant="dark"
                onClick={handleStart}
              >
                {t('actionExploreLandscape')}
              </button>
              <LangLink className="GetInTouch btn btn-white btn-lg" to={BiographiesRoute.to}>
                {t('allAvailableStories')}
              </LangLink>
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
            <div className="overlay__intro_exp pointer-events-auto">
              <p>{t('pagesHomeSubheading')}</p>
            </div>
            <div className="overlay__actions">
              <Button text={t('backToIntroduction')} variant="light" onClick={handleEnd} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overlay__copy">
        <p>Copyright © Université du Luxembourg 2023. All rights reserved.</p>
      </div>
      <div className={`overlay__logos ${hasStarted && 'overlay__logos_collapsed'}`}>
        <Logotypes />
      </div>
      <div className={`overlay__logo_soah ${hasStarted && 'overlay__logo_soah_collapsed'}`}>
        <FondationLogo />
      </div>
    </div>
  )
}
