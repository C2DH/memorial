import './styles/modal.css'
import { Divider } from './Divider.jsx'
import { IconsNext, IconsPrev } from './Icons.jsx'

import { usePebblesStore } from '../store'

import { motion, AnimatePresence, animate } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import downsize from 'downsize'
import LangLink from '../../LangLink'

const usePeriodicAnimation = (interval, callback) => {
  const [animValue, setAnimValue] = useState(0)

  useEffect(() => {
    const handle = setInterval(() => {
      setAnimValue((prev) => 1 - prev)
      callback()
    }, interval)

    return () => clearInterval(handle)
  }, [interval, callback])

  return animValue
}

export const ModalDetails = ({ stories = [], ...props }) => {
  const { t } = useTranslation()
  const { selectedPebble, hasDetails } = usePebblesStore()
  const selectedStory =
    selectedPebble && selectedPebble.linkedBioId && stories.length > 0
      ? stories.find((story) => story.id === selectedPebble.linkedBioId)
      : null

  const handleNext = () => {
    usePebblesStore.getState().selectAdjacentPebble(1)
    usePebblesStore.getState().setUserInteracted(true)
  }

  const handlePrev = () => {
    usePebblesStore.getState().selectAdjacentPebble(-1)
    usePebblesStore.getState().setUserInteracted(true)
  }

  const variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  }

  const handleNextAuto = () => {
    if (usePebblesStore.getState().hasStarted && !usePebblesStore.getState().userInteracted) {
      usePebblesStore.getState().selectAdjacentPebble(1)
    }
  }

  const animValue = usePeriodicAnimation(4500, handleNextAuto)

  useEffect(() => {
    const tickerBox = document.getElementById('tickerDiv')
    if (usePebblesStore.getState().hasStarted && !usePebblesStore.getState().userInteracted) {
      tickerBox &&
        animate(
          tickerBox,
          {
            scaleX: [0, 1],
          },
          { duration: 3 },
        )
    }
  }, [animValue])

  return (
    <AnimatePresence>
      {hasDetails && (
        <motion.div
          className="hero__modal"
          initial={{ opacity: 0, translateY: '8rem', scale: 0.85 }}
          animate={{ opacity: 1, translateY: '0rem', scale: 1 }}
          exit={{ opacity: 0, translateY: '8rem', scale: 0.85 }}
        >
          <div id="tickerDiv" className="hero__modal__carousel-ticker"></div>
          <div className="hero__modal__header">
            <div className="hero__modal__carousel">
              <div className="hero__modal__wrapper">
                <IconsPrev onClick={handlePrev} />
                <div className="hero__modal__carousel-content">
                  <div className="hero__modal__name">
                    <AnimatePresence mode="wait">
                      <motion.h4
                        className="hero__modal__title"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        key={selectedPebble.createdBy}
                      >
                        {selectedStory ? (
                          <b
                            className="small"
                            dangerouslySetInnerHTML={{
                              __html: downsize(selectedStory.data.title, {
                                characters: 80,
                                append: '&hellip;',
                              }),
                            }}
                          />
                        ) : null}
                      </motion.h4>
                    </AnimatePresence>
                  </div>
                </div>
                <IconsNext onClick={handleNext} />
              </div>
              <Divider />
            </div>
          </div>
          <div className="hero__modal__body">
            <AnimatePresence mode="wait">
              <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                key={selectedPebble.createdBy}
                className="hero__modal__body-text"
              >
                This pebble was left by <b>{selectedPebble.createdBy}</b> on
                <br />
                {t('dateShort', { date: new Date(selectedPebble.createdAt) })}
              </motion.div>
            </AnimatePresence>
            <Divider />
          </div>
          {selectedStory ? (
            <LangLink to={`/story/${selectedStory.slug}`}>{t('actionReadBiography')}</LangLink>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
