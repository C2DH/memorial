import React from 'react'
import { useTranslation } from 'react-i18next'
import AuthorItem from './AuthorItem'
import CoverItems from './CoverItems'
import LangLink from './LangLink'
import AvailableLanguages from './AvailableLanguages'
import { useAvailableLanguage } from '../hooks/language'
import '../styles/components/StoryItem.css'

const StoryItem = ({ story, className = '' }) => {
  const { t } = useTranslation()

  const { availableLanguage, availableLanguages } = useAvailableLanguage({
    translatable: story.data.title,
  })
  const title =
    availableLanguage === null
      ? story.data.title || story.title || story.slug
      : story.data.title[availableLanguage]
  console.info('[StoryItem]', '\n - title:', title, '\n - availableLanguages:', availableLanguages)
  return (
    <div className={`StoryItem d-flex align-items-center ${className}`}>
      {story.covers.length ? <CoverItems covers={story.covers} /> : null}
      <div className="ms-3">
        <LangLink className="StoryItem_title" to={`/story/${story.slug}`}>
          <h4 className="m-0 ">{title}</h4>
        </LangLink>
        <div className="StoryItem_authors">
          <label>{t('writtenBy')}</label>&nbsp;
          {story.authors.map((a, i) => (
            <span key={i}>
              <AuthorItem author={a} />
            </span>
          ))}
        </div>
        <AvailableLanguages
          className="StoryItem_languages"
          languages={availableLanguages}
          language={availableLanguage}
        />
      </div>
    </div>
  )
}

export default StoryItem
