import React from 'react'
import { useTranslation } from 'react-i18next'
import AuthorItem from './AuthorItem'
import CoverItems from './CoverItems'
import LangLink from './LangLink'
import { LanguageCodes, MillerLanguages } from '../constants'

import '../styles/components/StoryItem.css'

const StoryItem = ({ story, className = '' }) => {
  const { t, i18n } = useTranslation()
  const language = i18n.language.split('-').join('_')
  const availableLanguages = Object.keys(story.data.title)
  if (!availableLanguages.length) {
    console.error('[StoryItem] No language available in story.data.title', '\n - story :', story)
    return null
  }
  // get available language from title
  const availableLanguage =
    typeof story.data.title[language] === 'undefined' ? availableLanguages[0] : language
  console.info('[StoryItem]', story.data.title, availableLanguages)
  return (
    <div className={`StoryItem d-flex align-items-center ${className}`}>
      {story.covers.length ? <CoverItems covers={story.covers} /> : null}
      <div className="ms-3">
        <LangLink className="StoryItem_title" to={`/story/${story.slug}`}>
          <h4 className="m-0 ">{story.data.title[availableLanguage]}</h4>
        </LangLink>
        <div className="StoryItem_authors">
          <label>{t('writtenBy')}</label>&nbsp;
          {story.authors.map((a, i) => (
            <span key={i}>
              <AuthorItem author={a} />
            </span>
          ))}
        </div>
        <div className="StoryItem_languages">
          <label>{t('translatedIn')}</label>&nbsp;
          {LanguageCodes.map((d, i) => {
            const disabled = !availableLanguages.includes(MillerLanguages[i])
            return disabled ? (
              <del key={i} className="pe-2">
                {t(`language${d.toUpperCase()}`)}
              </del>
            ) : (
              <span key={i} className="pe-2">
                {t(`language${d.toUpperCase()}`)}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StoryItem
