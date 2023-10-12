import './styles/modal.css'
import React, { useState } from 'react'

import { Divider } from './Divider.jsx'
import { IconsNext, IconsPrev } from './Icons.jsx'
import { Button } from './Button.jsx'

import { usePebblesStore } from '../store'

import { motion, AnimatePresence } from 'framer-motion'

import * as c from '../sceneConfig'
import SelectStory from '../components/SelectStory'

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

export const ModalCreate = ({ stories = [], ...props }) => {
  const pebbleOptions = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]

  const { hasCreate } = usePebblesStore()

  const [[page, direction], setPage] = useState([0, 0])

  const handleCreatePebble = () => {
    usePebblesStore.getState().createPebble(nickname, selectedColor)
    usePebblesStore.getState().setUserInteracted(true)
  }

  const pebbleIndex = wrap(0, pebbleOptions.length, page)

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection])
    setColor(wrap(0, pebbleOptions.length, page + newDirection))
  }

  const [nickname, setNickname] = useState('')
  const [selectedColor, setColor] = useState(0)

  return (
    <AnimatePresence>
      {hasCreate && (
        <motion.div
          className="hero__modal"
          initial={{ opacity: 0, translateY: '8rem', scale: 0.85 }}
          animate={{ opacity: 1, translateY: '0rem', scale: 1 }}
          exit={{ opacity: 0, translateY: '8rem', scale: 0.85 }}
        >
          <div className="hero__modal__header">
            <div className="hero__modal__overline pb-3">
              <SelectStory stories={stories} />
            </div>
            <div className="hero__modal__overline">Choose a Pebble Color:</div>
            <div className="hero__modal__carousel">
              <Divider />
              <div className="hero__modal__wrapper">
                <IconsPrev onClick={() => paginate(-1)} />
                <div className="hero__modal__carousel-pebble">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={page}
                      className="hero__modal__carousel-slide"
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
                      <div className="hero__modal__carousel-img">
                        <img
                          src={`/pebbles/pebbleImage${[pebbleIndex + 1]}.png`}
                          alt={pebbleOptions[pebbleIndex].title}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <IconsNext onClick={() => paginate(1)} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {c.ghibliPalette.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      backgroundColor: color,
                      borderRadius: '1rem',
                      cursor: 'pointer',
                      border: selectedColor === i ? '2px solid hsla(0,0%,0%, 0.3)' : 'none',
                    }}
                    onClick={() => {
                      setColor(i)
                      setPage([i, 0])
                    }}
                  ></div>
                ))}
              </div>
              <Divider />
            </div>
          </div>
          <div className="hero__modal__bottom">
            <div className="hero__modal__names">
              <div className="hero__modal__nickname">
                <label htmlFor="nickname" className="hero__modal__overline">
                  Nickname
                </label>
                <input
                  type="text"
                  id="nickname"
                  className="hero__modal__nickname-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="hero__modal__actions">
            <Button text="Create" variant="dark" onClick={handleCreatePebble} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
