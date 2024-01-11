import './styles/modal.css'
import { Divider } from './Divider.jsx'
import { IconsNext, IconsPrev } from './Icons.jsx'

import { usePebblesStore } from '../store'

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import downsize from 'downsize'
import LangLink from '../../LangLink'

export const ModalDetails = ({ stories = [] }) => {
  const { t } = useTranslation()
  const selectedPebble = usePebblesStore((state) => state.selectedPebble)
  const hasDetails = usePebblesStore((state) => state.hasDetails)

  const selectedStory =
    selectedPebble && selectedPebble.linkedBioId && stories.length > 0
      ? stories.find((story) => story.slug === selectedPebble.linkedBioId)
      : null

  const isAtStart = usePebblesStore((state) => state.isFirstPebble())
  const isAtEnd = usePebblesStore((state) => state.isLastPebble())

  const handleNext = () => {
    if (!isAtEnd) {
      usePebblesStore.getState().selectAdjacentPebble(1)
      usePebblesStore.getState().setUserInteracted(true)
    }
  }

  const handlePrev = () => {
    if (!isAtStart) {
      usePebblesStore.getState().selectAdjacentPebble(-1)
      usePebblesStore.getState().setUserInteracted(true)
    }
  }

  const variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  }

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
                <IconsPrev onClick={handlePrev} disabled={isAtStart} />
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
                              __html: downsize(selectedStory.data.title.en_GB, {
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
                <IconsNext onClick={handleNext} disabled={isAtEnd} />
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
              >
                <p className="hero__modal__body-text-l">{selectedPebble.message}</p>
                <p className="hero__modal__body-text">
                  By <b>{selectedPebble.createdBy}</b> on&nbsp;
                  {t('dateShort', { date: new Date(selectedPebble.createdAt) })}
                </p>
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
