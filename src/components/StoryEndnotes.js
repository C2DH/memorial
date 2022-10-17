import React from 'react'
import { useTranslation } from 'react-i18next'
import ModuleText from './StoryModule/ModuleText'

const StoryEndnotes = ({ language = 'en_GB', endnotes = {}, className }) => {
  const { t } = useTranslation()
  const availableLanguages = Object.keys(endnotes).filter(
    (k) => typeof endnotes[k] === 'string' && endnotes[k].length > 0,
  )
  console.debug('[StoryEndnotes] available languages:', availableLanguages)
  if (!availableLanguages.length) {
    return null
  }
  const content =
    availableLanguages.indexOf(language) !== -1
      ? endnotes[language]
      : endnotes[availableLanguages[0]]
  return (
    <section className={`StoryEndnotes ${className}`}>
      <h3>{t('notes')}</h3>
      <ModuleText content={content} />
    </section>
  )
}
export default StoryEndnotes
