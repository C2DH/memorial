import React from 'react'
import Person from '../../models/Person'
import LangLink from '../LangLink'
import { useTranslation } from 'react-i18next'

const DocumentViewerPerson = ({ doc:person }) => {
  const {t} = useTranslation()
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
    convoy: person.data.convoy,
    notes: person.data.notes,
  })
  const picture = person.data.resolutions?.thumbnail
  // console.info('DocumentViewerPerson person:', person)
  return (
    <div className="DocumentViewerPerson">
      {picture
        ? <img src={picture.url} alt={t('pictureOf', { name: person.data.first_name })}/>
        : null
      }
      <LangLink to={`/person/${person.slug}`}>
      <span className="capitalize font-weight-bold">{per.lastName} <b>{per.firstName}</b></span></LangLink>,
      <span> {per.professions.join(', ')}</span>
       was born in {per.birthPlace} the {per.birthDate}
      <div>convoy: {per.convoy}</div>
      <div className="small p-2">
        {per.notes} [{person.data.households}]
      </div>
    </div>
  )
}

export default DocumentViewerPerson
