import { PebbleIcon } from './SvgIcons'
import React, { useState } from 'react'
import CreatePebbleMenu from './CreatePebbleMenu'
import '../styles/components/PebbleSideIcon.css'
import { useTranslation } from 'react-i18next'
import { PlusCircle } from 'react-feather'
const PebbleSideIcon = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const { t } = useTranslation()
  return (
    <>
      <div className="pebble-side-icon-wrapper">
        <div onClick={handleShow} className="pebble-side-icon d-none d-md-flex">
          <p>{t('modalIconCreate')}</p>
          <PlusCircle />
          <p>{t('modalIconPebble')}</p>
        </div>
      </div>
      <CreatePebbleMenu show={show} handleClose={handleClose}></CreatePebbleMenu>
    </>
  )
}

export default PebbleSideIcon
