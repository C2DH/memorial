import { useTranslation } from 'react-i18next'

export const useAvailableLanguage = ({ translatable = {} }) => {
  const { i18n } = useTranslation()
  const language = i18n.language.split('-').join('_')
  const availableLanguages = Object.keys(translatable).filter(
    (d) => typeof translatable[d] === 'string',
  )
  if (!availableLanguages.length) {
    console.error(
      '[useAvailableLanguage] No language available...',
      '\n - translatable :',
      translatable,
    )
  }
  const availableLanguage =
    availableLanguages.length && typeof translatable[language] !== 'string'
      ? availableLanguages[0]
      : language
  console.debug(
    '[useAvailableLanguage]',
    '\n - availableLanguage:',
    availableLanguage,
    '\n - requested language:',
    language,
    '\n - translatable:',
    translatable,
  )
  return { availableLanguages, availableLanguage, language }
}
