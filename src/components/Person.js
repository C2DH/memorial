import React from 'react'
import LangLink from './LangLink'

const Person = ({ doc, className = '', active = false }) => {
  return (
    <div className={`Person ${className}`}>
      {active ? (
        <LangLink className="Person_title" to={`/person/${doc.slug}`}>
          <h4 className="m-0 ">{doc.title}</h4>
        </LangLink>
      ) : (
        <h4 className="m-0 fw-bold">{doc.title}</h4>
      )}
      <div className="small">
        {doc.data.birth_date}
        <br />
        {doc.data.birth_place} {doc.data.birth_country}
      </div>
    </div>
  )
}

export default Person
