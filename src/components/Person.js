import React from 'react'
import LangLink from './LangLink'

const Person = ({ doc }) => {
  return (
    <div>
      <LangLink className="Person_title" to={`/person/${doc.slug}`}>
        <h4 className="m-0 ">{doc.title}</h4>
      </LangLink>
      <div className="small">
        {doc.data.birth_date}
        <br />
        {doc.data.birth_place} {doc.data.birth_country}
      </div>
    </div>
  )
}

export default Person
