import { PebbleIcon } from './SvgIcons'
import React, { useState } from 'react'
import CreatePebbleMenu from './CreatePebbleMenu'
import '../styles/components/PebbleTextIcon.css'

const PebbleSideIcon = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  return (
    <>
      <div onClick={handleShow} className="pebble-side-icon d-none d-md-flex">
        <p>create</p>
        <PebbleIcon></PebbleIcon>
        <p>pebble</p>
      </div>
      <CreatePebbleMenu show={show} handleClose={handleClose}></CreatePebbleMenu>
    </>
  )
}

export default PebbleSideIcon
