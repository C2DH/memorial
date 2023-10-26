import React from 'react'
import LangLink from './LangLink'
import { useTranslation } from 'react-i18next'

import AuthorItem from './AuthorItem'

import { useAvailableLanguage } from '../hooks/language'
import '../styles/components/StoryItem.css'
import downsize from 'downsize'

const StoryItemSmall = ({ story }) => {
  const { availableLanguage, availableLanguages } = useAvailableLanguage({
    translatable: story.data.title,
  })

  let title =
    availableLanguage === null
      ? story.data.title || story.title || story.slug
      : story.data.title[availableLanguage]

  title = downsize(title, { characters: 50, append: '&hellip;' })

  console.info('[StoryItem]', '\n - title:', title, '\n - availableLanguages:', availableLanguages)
  console.info(story)

  const { t } = useTranslation()

  return (
    <div
      className="flex space-x-0"
      style={{
        display: 'flex',
        gap: '0.35rem',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <LangLink className="StoryItem_title" to={`/story/${story.slug}`}>
        <h4
          className="hero__modal__title"
          style={{ fontWeight: 700 }}
          dangerouslySetInnerHTML={{
            __html: title
              .split(/[[\]]/)
              .join('')
              .split(/\{[^}]+\}/)
              .join(''),
          }}
        />
      </LangLink>
      <p className="hero__modal__overline">{t('writtenBy')}</p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: '0.25rem',
          justifyContent: 'center',
        }}
      >
        {story.authors.map((author) => (
          <AuthorItem key={author.id} author={author} />
        ))}
      </div>
    </div>
  )
}

export default StoryItemSmall
