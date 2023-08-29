import './Modal.css'
import { Divider } from './Divider.jsx'
import { IconsNext, IconsPrev, IconsClose } from './Icons.jsx'
import { Button } from './Button.jsx'

import { usePebblesStore } from '../store'

import { motion, AnimatePresence } from 'framer-motion'

export const ModalCreate = ({ ...props }) => {
  const { hasCreate } = usePebblesStore()

  const handleClose = () => {
    usePebblesStore.getState().setHasCreate(false)
    usePebblesStore.getState().setSelected(null)
  }

  return (
    <AnimatePresence>
      {hasCreate && (
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
            <div className="modal__overline">Select Pebble</div>
            <div className="modal__carousel">
              <Divider />
              <div className="modal__wrapper">
                <IconsPrev />
                <div className="modal__carousel-content">
                  <div className="modal__name">
                    <div className="modal__title">x</div>
                    <div className="modal__subtitle">x</div>
                  </div>
                </div>
                <IconsNext />
              </div>
              <Divider />
            </div>
          </div>
          <div className="modal__bottom">
            <div className="modal__names">
              <div className="modal__biography-selector">
                <div className="modal__in-memory-of">in memory of </div>
                <div className="modal__selector">
                  <div className="modal__select-biography">select biography </div>
                </div>
                <Divider />
              </div>
            </div>
          </div>
          <div className="modal__actions">
            <Button text="Create" variant="dark" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
