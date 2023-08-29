import './Modal.css'
import { Divider } from './Divider.jsx'
import { IconsNext, IconsPrev, IconsClose } from './Icons.jsx'

import { usePebblesStore } from '../store'
import { mockedData } from '../mockedData'

import { motion, AnimatePresence } from 'framer-motion'

export const ModalDetails = ({ ...props }) => {
  const { selected, hasDetails } = usePebblesStore()

  const handleClose = () => {
    usePebblesStore.getState().setHasDetails(false)
    usePebblesStore.getState().setSelected(null)
  }

  return (
    <AnimatePresence>
      {hasDetails && (
        <motion.div
          className="modal"
          initial={{ opacity: 0, translateY: '8rem', scale: 0.85 }}
          animate={{ opacity: 1, translateY: '0rem', scale: 1 }}
          exit={{ opacity: 0, translateY: '8rem', scale: 0.85 }}
        >
          <div className="modal__top" onClick={handleClose}>
            <IconsClose />
          </div>
          <div className="modal__top2">
            <div className="modal__overline">
              This pebble was created on {mockedData[selected].dateAdded}
            </div>
            <div className="modal__overline">by {mockedData[selected].addedBy}</div>
            <div className="modal__carousel">
              <Divider />
              <div className="modal__wrapper">
                <IconsPrev />
                <div className="modal__carousel-content">
                  <div className="modal__name">
                    <div className="modal__title">{mockedData[selected].fullName}</div>
                    <div className="modal__subtitle">{mockedData[selected].bornLived}</div>
                  </div>
                </div>
                <IconsNext />
              </div>
              <Divider />
            </div>
          </div>
          <div className="modal__body">
            <div className="modal__body-text">
              Body text Chaim David Borenstein and Nacha Leschinsky, who came from near Lodz,
              emigrated to Darmstadt in Germany shortly after the birth of their son Isaak in
              1910...
            </div>
            <Divider />
          </div>
          <div className="modal__actions">
            <div className="modal__read-more">Read more </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
