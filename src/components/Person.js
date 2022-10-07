import React from 'react'
import { useTranslation } from 'react-i18next'
import LangLink from './LangLink'
import { useDate } from '../hooks/date'

const Person = ({ doc, className = '', active = false }) => {
  const { t, i18n } = useTranslation()
  const { parseDate } = useDate({ language: i18n.language.split('_').join('-') })
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
        {parseDate(doc.data.birth_date)}&nbsp;&mdash;&nbsp;
        {parseDate(doc.data.death_date, false, null, t('unkownDate'))}
        <br />
        {doc.data.birth_place} {doc.data.birth_country}
      </div>
    </div>
  )
}

export default Person
