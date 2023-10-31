import React, { useState, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { usePebblesStore } from '../store'
import { motion, AnimatePresence } from 'framer-motion'
import { ModalCarousel } from './ModalCarousel'
import StoryItemSmall from '../../StoryItemSmall'
import { useTranslation } from 'react-i18next'

import './styles/modal.css'

export const ModalCreate = ({ ...props }) => {
  const nickNameRef = useRef()

  const { hasCreate, currentStory } = usePebblesStore()

  const handleCreatePebble = () => {
    usePebblesStore.getState().createPebble(nickNameRef.current.value, selectedColor, 77)
    usePebblesStore.getState().setUserInteracted(true)
  }

  const [selectedColor, setColor] = useState(0)

  const { t } = useTranslation()

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
            <div className="hero__modal__title">Create Pebble</div>
            <div className="hero__modal__carousel">
              <div
                style={{
                  padding: '1rem',
                  height: '10rem',
                }}
              >
                <StoryItemSmall story={currentStory} />
              </div>
            </div>
            <div className="hero__modal__carousel">
              <ModalCarousel options={[0, 1, 2, 3, 4]} setOption={setColor}>
                <div className="hero__modal__carousel-img">
                  <img src={`/pebbles/pebbleImage${[selectedColor + 1]}.png`} alt="decoration" />
                </div>
              </ModalCarousel>
            </div>
            <div className="hero__modal__carousel">
              <Form
                className="w-full"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (nickNameRef.current && nickNameRef.current.value.length > 1) {
                    handleCreatePebble()
                  } else {
                    handleCreatePebble()
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <Form.Control
                    placeholder={'Your signature'}
                    aria-label={t('pagesPeopleSearchPlaceholder')}
                    aria-describedby="basic-addon2"
                    className="SignatureField"
                    ref={nickNameRef}
                  />
                  <button
                    className="btn btn-green btn-lg SearchField_inputSubmit"
                    id="button-create"
                  >
                    {t('actionCreatePebble')}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
