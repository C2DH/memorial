import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Turnstile from 'react-turnstile'
import StoryItem from '../../StoryItem'
import ColorPicker from './ColorPicker'
import InputField from '../../InputField'
import TextareaField from '../../TextareaField'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation } from 'react-query'
import { ModalCarousel } from './ModalCarousel'
import { usePebblesStore, createNewPebble } from '../store'
import { useTranslation } from 'react-i18next'
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

const ModalCreate = ({ withCarousel = false }) => {
  const { t } = useTranslation()
  const hasCreate = usePebblesStore((state) => state.hasCreate)
  const currentStory = usePebblesStore((state) => state.currentStory)
  const createPebble = usePebblesStore((state) => state.createPebble)
  const setUserInteracted = usePebblesStore((state) => state.setUserInteracted)
  const setHasCreate = usePebblesStore((state) => state.setHasCreate)
  const setSelected = usePebblesStore((state) => state.setSelected)
  const setHasDetails = usePebblesStore((state) => state.setHasDetails)
  const setShowConfirmationModal = usePebblesStore((state) => state.setShowConfirmationModal)

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
      onSuccess: () => {
        console.debug('[ModalCreate] useMutation onSuccess')
        setShowConfirmationModal(true)
      },
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
      scale: newPebbleData.scale,
      color: PebbleColors[selectedColor],
    })
  }

  useEffect(() => {
    let { positionX, positionZ } = usePebblesStore.getState().lastPebbleData
    if(!currentStory) return
    const previewPebble = createNewPebble(
      createdBy,
      message,
      PebbleColors[selectedColor],
      currentStory.slug,
      positionX,
      positionZ,
    )

    setSelected(previewPebble)

    if (status === 'success') {
      createPebble(newPebbleData)
      setUserInteracted(true)
      setSelected(newPebbleData)
      // only direct interaction can set it to false
      // setHasCreate(false)
      setHasDetails(true)
    }
    console.log(status)
  }, [
    status,
    createPebble,
    createdBy,
    currentStory?.slug,
    message,
    newPebbleData,
    selectedColor,
    setHasDetails,
    setSelected,
    setUserInteracted,
  ])

  console.debug(
    '[ModalCreate] render',
    '\n - hasCreate:',
    hasCreate,
    '\n - currentStory:',
    currentStory?.slug,
  )

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
            <StoryItem story={currentStory} reduced />
          </div>
          <div className="Form w-100 mt-3" style={{ textAlign: 'start' }}>
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

export default ModalCreate
