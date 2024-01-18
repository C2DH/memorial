import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { useMutation } from 'react-query'
import axios from 'axios'

import { ModalCarousel } from './ModalCarousel'
import StoryItem from '../../StoryItem'

import Turnstile from 'react-turnstile'

import { usePebblesStore, createNewPebble } from '../store'
import { useTranslation } from 'react-i18next'
import ColorPicker from './ColorPicker'
import { PebbleColors } from '../../../constants'

const SITE_KEY = import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY

const readCookie = (name) => {
  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(nameEQ)) {
      return cookie.substring(nameEQ.length)
    }
  }
  return null
}

export const ModalCreate = ({ withCarousel = false }) => {
  const { t } = useTranslation()
  const hasCreate = usePebblesStore((state) => state.hasCreate)
  const currentStory = usePebblesStore((state) => state.currentStory)
  const createPebble = usePebblesStore((state) => state.createPebble)
  const setUserInteracted = usePebblesStore((state) => state.setUserInteracted)
  const setHasCreate = usePebblesStore((state) => state.setHasCreate)
  const setHasDetails = usePebblesStore((state) => state.setHasDetails)

  const [token, setToken] = useState(null)
  const [createdBy, setCreatedBy] = useState('')
  const [message, setMessage] = useState('')
  const [selectedColor, setSelectedColor] = useState(0)
  const [newPebbleData, setNewPebbleData] = useState(null)

  const csrftoken = readCookie('csrftoken')

  const { status, mutate } = useMutation(
    (payload) => {
      console.debug('[ModalCreate] useMutation', payload)
      return axios.post('/api/pebbles/', payload, {
        headers: { 'X-CSRFToken': csrftoken },
      })
    },
    {
      onError: (err) => {
        console.error(err.response)
        if (err.response?.data?.position?.code === 'WrongPosition') {
          handleSubmit(true, err.response.data.position.suggested_position)
        }
      },
    },
  )

  const handleSubmit = (suggested_position, retry = false) => {
    let { positionX, positionZ } = usePebblesStore.getState().lastPebbleData

    // If the prev postion was rejected, use the suggested position:
    if (retry && suggested_position) {
      console.log('-------------------------retrying-------------------------')
      console.log(suggested_position)
      positionX = parseFloat(suggested_position[0])
      positionZ = parseFloat(suggested_position[2])
    }

    // Recalculate the correct y position:
    const newPebbleData = createNewPebble(
      createdBy,
      message,
      PebbleColors[selectedColor],
      currentStory.slug,
      positionX,
      positionZ,
    )

    setNewPebbleData(newPebbleData)

    mutate({
      createdBy,
      linkedBioId: currentStory.slug,
      message,
      shape: '',
      token,
      position: newPebbleData.position,
      rotation: newPebbleData.rotation,
      scale: [1, 1, 1],
      color: PebbleColors[selectedColor],
    })
  }

  useEffect(() => {
    if (status === 'success') {
      createPebble(newPebbleData)
      setUserInteracted(true)
      // only direct interaction can set it to false
      // setHasCreate(false)
      setHasDetails(true)
    }
    console.log(status)
  }, [
    status,
    createdBy,
    currentStory,
    createPebble,
    setUserInteracted,
    setHasCreate,
    setHasDetails,
    newPebbleData,
  ])

  return (
    <AnimatePresence>
      {hasCreate && (
        <motion.div
          className="hero__modal"
          initial={{ opacity: 0, translateY: '8rem', scale: 0.85 }}
          animate={{ opacity: 1, translateY: '0rem', scale: 1 }}
          exit={{ opacity: 0, translateY: '8rem', scale: 0.85 }}
        >
          <h3>{t('actionCreatePebble')}</h3>
          <div className="hero__modal__carousel">
            <StoryItem story={currentStory} />
          </div>
          <div className="Form w-100 mt-3" style={{ textAlign: 'start', maxWidth: 500 }}>
            {withCarousel ? (
              <div className="hero__modal__carousel mx-3 ">
                <ModalCarousel options={[0, 1, 2, 3, 4]} setOption={setSelectedColor}>
                  <div className="hero__modal__carousel-img">
                    <img src={`/pebbles/pebbleImage${[selectedColor + 1]}.png`} alt="decoration" />
                  </div>
                </ModalCarousel>
              </div>
            ) : (
              <>
                <label>Pick a color</label>
                <ColorPicker
                  className="my-4"
                  onChange={(c, i) => {
                    console.debug('[ModalCreateNew] change color: ', i)
                    setSelectedColor(i)
                  }}
                />
              </>
            )}

            <TextareaField
              label={t('pebbleMessageLabel')}
              placeholder={t('pebbleMessagePlaceholder')}
              id="message"
              value={message}
              onChange={setMessage}
            />
            <InputField
              id="createdBy"
              placeholder={t('pebbleCreatedByPlaceholder')}
              value={createdBy}
              onChange={setCreatedBy}
            />
            <Turnstile
              className="mb-3 w-100"
              sitekey={SITE_KEY}
              theme="light"
              onVerify={setToken}
            />
          </div>
          <div className="w-100 d-flex flex-row justify-content-between">
            <button
              className="btn btn-green btn-lg SearchField_inputSubmit"
              disabled={!token}
              onClick={handleSubmit}
            >
              {t('actionModalCreatePebble')}
            </button>
            <button
              className="btn btn-secondary btn-lg SearchField_inputSubmit"
              disabled={!token}
              onClick={() => {
                setHasCreate(false)
              }}
            >
              {t('actionModalDiscard')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const InputField = ({ label, id, value, placeholder, onChange }) => (
  <div className="mb-3">
    {label ? (
      <label htmlFor={id} className="form-label">
        {label}
      </label>
    ) : null}
    <input
      type="text"
      placeholder={placeholder}
      className="form-control"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

const TextareaField = ({ label, id, value, placeholder = 'your message here...', onChange }) => (
  <div className="mb-3">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <textarea
      className="form-control"
      id={id}
      rows="3"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    ></textarea>
  </div>
)
