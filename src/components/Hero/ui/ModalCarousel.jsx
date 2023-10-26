import './styles/modal.css'
import React, { useState } from 'react'

import { IconsNext, IconsPrev } from './Icons.jsx'

import { motion, AnimatePresence } from 'framer-motion'

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? '24rem' : '-24rem',
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
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

export const ModalCarousel = ({ uid, options, setOption, height = 12, className, children }) => {
  const [[page, direction], setPage] = useState([0, 0])

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection])
    setOption(wrap(0, options.length, page + newDirection))
  }

  return (
    <>
      <div className={`hero__modal__wrapper ${className}`}>
        <div
          style={{
            position: 'absolute',
            left: '-1rem',
            zIndex: 2,
          }}
        >
          <IconsPrev onClick={() => paginate(-1)} />
        </div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: `${height}rem`,
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={uid || page}
              style={{
                position: 'absolute',
                width: '100%',
                height: `${height}rem`,
              }}
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
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        <div
          style={{
            position: 'absolute',
            right: '-1rem',
            zIndex: 2,
          }}
        >
          <IconsNext onClick={() => paginate(1)} />
        </div>
      </div>
    </>
  )
}
