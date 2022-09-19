import React from 'react'

const FootnoteDefinition = ({ identifier = '', label = '', children }) => {
  return (
    <div
      id={'def-' + identifier}
      className="FootnoteDefinition d-flex"
      style={{
        fontSize: 'var(--small-font-size)',
      }}
    >
      <label className="me-3">{label}</label>
      <div>{children}</div>
    </div>
  )
}

export default FootnoteDefinition
