import React, { useState, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { usePebblesStore } from '../store'
import { motion, AnimatePresence } from 'framer-motion'
import { ModalCarousel } from './ModalCarousel'
import { useGetJSON } from '../../../hooks/data'
import StoryItemSmall from '../../StoryItemSmall'
import { useTranslation } from 'react-i18next'
import { StringParam, useQueryParam } from 'use-query-params'
import { BiographyIdQueryParamName } from '../../../constants.js'
import './styles/modal.css'

export const ModalCreate = ({ ...props }) => {
  const { t } = useTranslation()
  const [biographyId] = useQueryParam(BiographyIdQueryParamName, StringParam)
  const nickNameRef = useRef()

  const { hasCreate } = usePebblesStore()

  const handleCreatePebble = () => {
    usePebblesStore
      .getState()
      .createPebble(nickNameRef.current.value, selectedColor, data?.results[selectedBio]?.id)
    usePebblesStore.getState().setUserInteracted(true)
  }

  const [selectedColor, setColor] = useState(0)
  const [selectedBio, setBio] = useState(0)

  const pebbleOptions = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]

  const params = {
    limit: 10,
    exclude: {
      tags__slug__in: ['static', 'convoy'],
    },
    orderby: '-date_last_modified',
  }

  if (biographyId) {
    params.filters = {
      slug: biographyId,
    }
  }

  const { data, status, error } = useGetJSON({
    url: '/api/story',
    params,
  })

  console.debug('[SelectStory] data:', data, '\n - status:', status, '\n - error:', error, params)

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
              {data?.results?.length === 1 ? (
                <div
                  style={{
                    padding: '1rem',
                    height: '10rem',
                  }}
                >
                  <StoryItemSmall story={data?.results[selectedBio]} />
                </div>
              ) : null}
              {data.results?.length > 1 ? (
                <ModalCarousel
                  uid={data?.results[selectedBio]?.id}
                  options={data?.results}
                  setOption={setBio}
                  height={10}
                >
                  <div
                    style={{
                      padding: '1rem',
                      height: '10rem',
                    }}
                  >
                    <StoryItemSmall story={data?.results[selectedBio]} />
                  </div>
                </ModalCarousel>
              ) : null}
            </div>
            <div className="hero__modal__carousel">
              <ModalCarousel options={pebbleOptions} setOption={setColor}>
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
                    // TODO: Trigger error state
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
