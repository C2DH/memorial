import './styles/modal.css'
import React, { useState } from 'react'

import { Divider } from './Divider.jsx'
import { IconsNext, IconsPrev, IconsClose } from './Icons.jsx'
import { Button } from './Button.jsx'

import { usePebblesStore } from '../store'

import { motion, AnimatePresence } from 'framer-motion'

const variants = {
  enter: (direction) => {
    return {
      rotate: 90,
      x: direction > 0 ? '24rem' : '-24rem',
      opacity: 0,
    }
  },
  center: {
    rotate: 0,
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      rotate: -90,
      zIndex: 0,
      x: direction < 0 ? '24rem' : '-24rem',
      opacity: 0,
    }
  },
}

const swipeConfidenceThreshold = 10000

const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity
}

const wrap = (min, max, value) => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

export const ModalCreate = ({ ...props }) => {
  const pebbles = [
    { title: 'Color Option 1', id: 0 },
    { title: 'Color Option 2', id: 1 },
    { title: 'Color Option 3', id: 2 },
    { title: 'Color Option 4', id: 3 },
    { title: 'Color Option 5', id: 4 },
  ]

  const { hasCreate, setHasCreate, setSelected, createPebble } = usePebblesStore()

  const [[page, direction], setPage] = useState([0, 0])

  const handleCreatePebble = () => {
    createPebble(nickname, color)
  }

  const handleClose = () => {
    setHasCreate(false)
    setSelected(null)
  }

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection])
  }

  const pebbleIndex = wrap(0, pebbles.length, page)

  const [nickname, setNickname] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [color, setColor] = useState(pebbles[0].id)

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
            <div className="modal__overline">Choose a Pebble Color:</div>
            <div className="modal__carousel">
              <Divider />
              <div className="modal__wrapper">
                <IconsPrev onClick={() => paginate(-1)} />
                <div className="modal__carousel-pebble">
                  <AnimatePresence initial={false} custom={direction}>
                    {/* each slide is a different color selector */}
                    <motion.div
                      key={page}
                      className="modal__carousel-slide"
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x)

                        if (swipe < -swipeConfidenceThreshold) {
                          paginate(1)
                        } else if (swipe > swipeConfidenceThreshold) {
                          paginate(-1)
                        }
                      }}
                    >
                      <div className="modal__carousel-img">
                        <img src="/pebbleTest.png" alt={pebbles[pebbleIndex].title} />
                        <p className="modal__overline">{pebbles[pebbleIndex].title}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <IconsNext onClick={() => paginate(1)} />
              </div>
              <Divider />
            </div>
          </div>
          <div className="modal__bottom">
            <div className="modal__names">
              <div className="modal__nickname">
                <label htmlFor="nickname" className="modal__overline">
                  Nickname
                </label>
                <input
                  type="text"
                  id="nickname"
                  className="modal__nickname-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="modal__actions">
            <Button text="Create" variant="dark" onClick={handleCreatePebble} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
