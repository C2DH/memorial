import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { useMutation } from 'react-query'
import axios from 'axios'

import { ModalCarousel } from './ModalCarousel'
import StoryItemSmall from '../../StoryItemSmall'

import Turnstile from 'react-turnstile'

import { usePebblesStore, createNewPebble } from '../store'

import * as c from '../sceneConfig'

const SITE_KEY = '0x4AAAAAAANc-pcojgasdnzO'

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

export const ModalCreate = () => {
  const hasCreate = usePebblesStore((state) => state.hasCreate)
  const currentStory = usePebblesStore((state) => state.currentStory)
  const createPebble = usePebblesStore((state) => state.createPebble)
  const setUserInteracted = usePebblesStore((state) => state.setUserInteracted)
  const setHasCreate = usePebblesStore((state) => state.setHasCreate)
  const setHasDetails = usePebblesStore((state) => state.setHasDetails)

  const [token, setToken] = useState(null)
  const [createdBy, setCreatedBy] = useState('Your name...')
  const [message, setMessage] = useState('Leave a meaningful message...')
  const [selectedColor, setColor] = useState(0)
  const [newPebbleData, setNewPebbleData] = useState(null)

  const csrftoken = readCookie('csrftoken')

  const { status, mutate } = useMutation(
    (payload) => {
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

  const handleSubmit = (retry = false, suggested_position = 0) => {
    let { positionX, positionZ } = usePebblesStore.getState().lastPebbleData

    if (retry) {
      positionZ = parseInt(suggested_position, 10) + 10
    }

    const newPebbleData = createNewPebble(
      createdBy,
      message,
      c.ghibliPalette[selectedColor],
      currentStory.slug,
      positionX,
      positionZ,
    )

    setNewPebbleData(newPebbleData)

    mutate({
      createdBy,
      linkedBioId: currentStory.slug,
      message,
      shape: 'shape_value',
      token,
      position: newPebbleData.position,
      rotation: newPebbleData.rotation,
      scale: [1, 1, 1],
      color: c.ghibliPalette[selectedColor],
    })
  }

  useEffect(() => {
    if (status === 'success') {
      createPebble(newPebbleData)
      setUserInteracted(true)
      setHasCreate(false)
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
          <div className="Form" style={{ textAlign: 'start', maxWidth: 500 }}>
            <div className="hero__modal__carousel">
              <StoryItemSmall story={currentStory} />
            </div>
            <div className="hero__modal__carousel mt-4">
              <ModalCarousel options={[0, 1, 2, 3, 4]} setOption={setColor}>
                <div className="hero__modal__carousel-img">
                  <img src={`/pebbles/pebbleImage${[selectedColor + 1]}.png`} alt="decoration" />
                </div>
              </ModalCarousel>
            </div>
            <InputField
              label="Created By"
              id="createdBy"
              value={createdBy}
              onChange={setCreatedBy}
            />
            <TextareaField label="Message" id="message" value={message} onChange={setMessage} />
            <div className="flex flex-row">
              <Turnstile className="mb-3" sitekey={SITE_KEY} theme="light" onVerify={setToken} />
              <button
                className="btn btn-green btn-lg SearchField_inputSubmit"
                disabled={!token}
                onClick={handleSubmit}
              >
                Create Pebble
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const InputField = ({ label, id, value, onChange }) => (
  <div className="mb-3">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <input
      type="text"
      className="form-control"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

const TextareaField = ({ label, id, value, onChange }) => (
  <div className="mb-3">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <textarea
      className="form-control"
      id={id}
      rows="3"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    ></textarea>
  </div>
)
