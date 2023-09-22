import './styles/modal.css'
import { Divider } from './Divider.jsx'
import { IconsNext, IconsPrev, IconsClose } from './Icons.jsx'
import { DateTime } from 'luxon'

import { usePebblesStore } from '../store'

import { motion, AnimatePresence } from 'framer-motion'

export const ModalDetails = ({ ...props }) => {
  const { selectedPebble, hasDetails } = usePebblesStore()

  const handleClose = () => {
    usePebblesStore.getState().setHasDetails(false)
    usePebblesStore.getState().setSelected(null)
  }

  const formatDate = (dateStr) => {
    const dt = DateTime.fromJSDate(dateStr)
    return dt.toFormat('ccc, DD')
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
          <div className="hero__modal__top" onClick={handleClose}>
            <IconsClose />
          </div>
          <div className="hero__modal__header">
            <p>
              <span className="hero__modal__overline"> This pebble was created on &nbsp;</span>
              <span className="hero__modal__overline hero__modal__accent">
                {formatDate(selectedPebble.createdAt)}
              </span>
            </p>
            <p>
              <span className="hero__modal__overline">by&nbsp;</span>
              <span className="hero__modal__overline hero__modal__accent">
                {selectedPebble.createdBy}
              </span>
            </p>
            <div className="hero__modal__carousel">
              <Divider />
              <div className="hero__modal__wrapper">
                <IconsPrev />
                <div className="hero__modal__carousel-content">
                  <div className="hero__modal__name">
                    <div className="hero__modal__title">FULL NAME</div>
                    <div className="hero__modal__subtitle">BORN – LIVED</div>
                  </div>
                </div>
                <IconsNext />
              </div>
              <Divider />
            </div>
          </div>
          <div className="hero__modal__body">
            <div className="hero__modal__body-text">
              Body text Chaim David Borenstein and Nacha Leschinsky, who came from near Lodz,
              emigrated to Darmstadt in Germany shortly after the birth of their son Isaak in
              1910...
            </div>
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
