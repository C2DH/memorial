import React from 'react'
import { useTranslation } from 'react-i18next'
import AuthorItem from './AuthorItem'

const StoryAuthors = ({ authors = [] }) => {
  const { t } = useTranslation()
  if (!authors.length) {
    return null
  }
  return (
    <div className="StoryAuthors">
      <label className="text-uppercase small fw-bold">{t('writtenBy')}</label>
      {authors.map((author) => (
        <AuthorItem key={author.id} author={author} className="ms-3" />
      ))}
    </div>
  )
}

export default StoryAuthors
