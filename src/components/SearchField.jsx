import React, { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, InputGroup } from 'react-bootstrap'
import { StatusIdle, StatusFetching } from '../hooks/data'
import '../styles/components/SearchField.css'

const SearchField = ({ defaultValue, onSubmit, status = StatusIdle }) => {
  const searchQueryRef = useRef()
  const { t } = useTranslation()

  useLayoutEffect(() => {
    if (searchQueryRef.current) {
      searchQueryRef.current.focus()
    }
  }, [status])

  return (
    <Form
      className="mt-5"
      onSubmit={(e) => {
        e.preventDefault()
        if (typeof onSubmit !== 'function') {
          console.error('You forgot to add onSubmit to this form ...')
          return
        }
        if (searchQueryRef.current && searchQueryRef.current.value.length > 1) {
          onSubmit(e, searchQueryRef.current.value)
        } else {
          onSubmit(e, undefined)
        }
      }}
    >
      <InputGroup size="lg">
        <Form.Control
          placeholder={t('pagesPeopleSearchPlaceholder')}
          aria-label={t('pagesPeopleSearchPlaceholder')}
          aria-describedby="basic-addon2"
          defaultValue={defaultValue}
          ref={searchQueryRef}
          className="SearchField_inputSearchQuery"
        />
        <button className="btn btn-white btn-lg SearchField_inputSubmit" id="button-addon2">
          {t(status === StatusFetching ? 'loading' : 'actionSearchPerson')}
        </button>
      </InputGroup>
    </Form>
  )
}

export default SearchField
