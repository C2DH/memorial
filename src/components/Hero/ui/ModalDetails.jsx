import './styles/modal.css'
import { Divider } from './Divider.jsx'
import { IconsNext, IconsPrev } from './Icons.jsx'
import { DateTime } from 'luxon'

import { usePebblesStore } from '../store'

import { motion, AnimatePresence, animate } from 'framer-motion'

import { useState, useEffect } from 'react'

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

export const ModalDetails = ({ ...props }) => {
  const { selectedPebble, hasDetails } = usePebblesStore()

  const handleNext = () => {
    usePebblesStore.getState().selectAdjacentPebble(1)
    usePebblesStore.getState().setUserInteracted(true)
  }

  const handlePrev = () => {
    usePebblesStore.getState().selectAdjacentPebble(-1)
    usePebblesStore.getState().setUserInteracted(true)
  }

  const formatDate = (dateStr) => {
    const dt = DateTime.fromJSDate(dateStr)
    return dt.toFormat('ccc, DD')
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
            <p>
              <span className="hero__modal__overline"> This pebble was created on &nbsp;</span>
              <AnimatePresence mode="wait">
                <motion.span
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  key={selectedPebble.createdBy}
                  className="hero__modal__overline hero__modal__accent"
                >
                  {formatDate(selectedPebble.createdAt)}
                </motion.span>
              </AnimatePresence>
            </p>
            <p>
              <span className="hero__modal__overline">by&nbsp;</span>
              <AnimatePresence mode="wait">
                <motion.span
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  key={selectedPebble.createdBy}
                  className="hero__modal__overline hero__modal__accent"
                >
                  {selectedPebble.createdBy}
                </motion.span>
              </AnimatePresence>
            </p>
            <div className="hero__modal__carousel">
              <Divider />
              <div className="hero__modal__wrapper">
                <IconsPrev onClick={handlePrev} />
                <div className="hero__modal__carousel-content">
                  <div className="hero__modal__name">
                    <AnimatePresence mode="wait">
                      <motion.div
                        className="hero__modal__title"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        key={selectedPebble.createdBy}
                      >
                        Elisabeth ROTHSCHILD
                      </motion.div>
                    </AnimatePresence>
                    <div className="hero__modal__subtitle">1920 – 1945</div>
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
                Body text Chaim David Borenstein and Nacha Leschinsky, who came from near Lodz,
                emigrated to Darmstadt in Germany shortly after the birth of their son Isaak in
                1910...
              </motion.div>
            </AnimatePresence>
            <Divider />
          </div>
          <div className="hero__modal__actions">
            <div className="hero__modal__inline-link">Read more </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
