import React from 'react'
import Person from '../../models/Person'
import LangLink from '../LangLink'

const DocumentViewerPerson = ({ person }) => {
  if (!person) {
    return null
  }
  const per = new Person({
    firstName: person.data.first_name,
    lastName: person.data.last_name,
    professions: person.data.professions,
    birthDate: person.data.birth_date,
    birthPlace: person.data.birth_place,
    deathDate: person.data.death_date,
    deathPlace: person.data.death_place,
    notes: person.data.notes,
  })
  console.info('DocumentViewerPerson person:', person)
  return (
    <div className="DocumentViewerPerson">
      <LangLink to={`/person/${person.slug}`}><span className="capitalize">{per.lastName} <b>{per.firstName}</b></span></LangLink>,
      <span> {per.professions.join(', ')}</span>
       was born in {per.birthPlace} the {per.birthDate}
      <div className="small p-2">
        {per.notes} [{person.data.households}]
      </div>
    </div>
  )
}

export default DocumentViewerPerson
