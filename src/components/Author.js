import React from 'react'
import { useTranslation } from 'react-i18next'
import authorIndex from '../data/authors.json'
import { useAvailableLanguage } from '../hooks/language'
import '../styles/components/Author.css'

const Author = ({ author = {}, className, ...props }) => {
  const { t } = useTranslation()
  const authorMetadata = authorIndex[author.slug]

  const { availableLanguage } = useAvailableLanguage({
    translatable: authorMetadata?.data.bio,
  })

  if (!authorMetadata) {
    return null
  }
  const fullname =
    typeof authorMetadata.data?.fullname === 'object'
      ? authorMetadata.data?.fullname[availableLanguage]
      : authorMetadata.fullname
  const bio =
    typeof authorMetadata.data?.bio === 'object' ? authorMetadata.data?.bio[availableLanguage] : ''
  return (
    <section className={`Author ${className}`} {...props}>
      <h2>{fullname}</h2>
      <label>{t('author')}</label>
      <p
        className="mt-3"
        dangerouslySetInnerHTML={{
          __html: bio,
        }}
      />
    </section>
  )
}

export default Author
