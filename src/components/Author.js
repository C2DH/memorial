import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetJSON } from '../hooks/data'
import { useAvailableLanguage } from '../hooks/language'
import '../styles/components/Author.css'

const Author = ({ author = {}, className, ...props }) => {
  const { t } = useTranslation()

  // load authro data from api
  const {
    data: authorMetadata,
    status,
    error,
  } = useGetJSON({
    url: `/api/author/${author.slug}/`,
  })

  console.debug('[Author] authorMetadata:', authorMetadata, status, error)

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
  const gender = ['M', 'F'].includes(authorMetadata.data?.gender) ? authorMetadata.data.gender : ''
  return (
    <section className={`Author ${className}`} {...props}>
      <h2>{fullname}</h2>
      <label>{t('author' + gender)}</label>
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
