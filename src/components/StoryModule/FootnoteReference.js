import React from 'react'

const FootnoteReference = (props) => {
  // console.debug('[FootnoteReference]', props)
  return (
    <>
      <sup id={'ref-' + props.identifier}>
        <a href={'#def-' + props.identifier}>{props.label}</a>
      </sup>
    </>
  )
}

export default FootnoteReference
