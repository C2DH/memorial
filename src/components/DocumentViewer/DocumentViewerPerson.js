import React from 'react'
import Person from '../../models/Person'
import LangLink from '../LangLink'
import { useTranslation } from 'react-i18next'

const DocumentViewerPerson = ({ doc }) => {
  const {t} = useTranslation()
  if (!doc) {
    return null
  }
  const per = doc instanceof Person ? doc : Person.create(doc)
  const picture = per.picture // person.data.resolutions?.thumbnail
  // console.info('DocumentViewerPerson person:', person)
  return (
    <div className="DocumentViewerPerson">
      {picture
        ? <img src={picture.url} alt={t('pictureOf', { name: per.first_name })}/>
        : null
      }
      <LangLink to={`/person/${per.slug}`}>
      <span className="capitalize font-weight-bold">{per.lastName} <b>{per.firstName}</b></span></LangLink>,
      <span> {per.professions.join(', ')}</span>
       was born in {per.birthPlace} the {per.birthDate}
      <div>convoy: {per.convoy}</div>
      {/*
      <div className="small p-2">
        {per.notes} [{person.data.households}]
      </div>
      */}
    </div>
  )
}

export default DocumentViewerPerson
