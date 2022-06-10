import i18n from 'i18next'
// import luxon from 'luxon'
import { initReactI18next, useTranslation } from 'react-i18next'
// import { matchPath } from 'react-router'
import { useParams } from 'react-router-dom'
import translations from '../translations'
import {
  Languages, LanguageCodes,
  DefaultLanguage, DefaultLanguageCode
} from '../constants'


const getLanguage = () => {
  // Match against language code. LanguageCodes = ['en', 'fr', 'de']
  const reLanguage = new RegExp(`^\/(${LanguageCodes.join('|')})\/?`)
  const pathLanguage = window.location.pathname.match(reLanguage)

  let languageCode = ''
  if (pathLanguage) {
    languageCode = pathLanguage[1]
  } else {
    // get default short language from browser
    const browserLangsShort = window.navigator?.languages ?? []
    console.info('browser languages detected:', browserLangsShort)
    const availablesLangsShort = browserLangsShort
      .map(d => d.split('-').shift().toLowerCase())
      .filter(d => LanguageCodes.includes(d))
    languageCode = availablesLangsShort.length > 0
        ? availablesLangsShort[0]
        : DefaultLanguageCode
  }

  console.debug('[getLanguage] languageCode:', languageCode)
  return {
    languageCode,
    language: Languages.find(l => l.indexOf(languageCode) === 0)
  }
}


const initializeI18next = () => {
  const { languageCode, language } = getLanguage()
  console.info('start language:', languageCode, language)
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: translations,
      lng: language,
      fallbackLng: [DefaultLanguageCode],
      interpolation: {
        escapeValue: false, // react already safes from xss
        format: function(value, format, lng) {
            // if(value instanceof Date) {
            //   if (format === 'fromNow') {
            //     return moment(value).fromNow()
            //   }
            //   return moment(value).format(format)
            // } else if (typeof value === 'number') {
            //   // adapt number
            //   return new Intl.NumberFormat(lng, { maximumFractionDigits: format }).format(value)
            // }
            return value;
        }
      }
    })
  return { languageCode, language }
}


function namespacePath(path, lang) {
  let pathWithLang = `/${lang}`
  if (path[0] === '/') {
    pathWithLang += path
  } else {
    pathWithLang += `/${path}`
  }
  return pathWithLang
}

const useToWithLang = (to, forceLanguage) => {
  const { i18n } = useTranslation()
  let { lang } = useParams()

  if (!lang) {
    // NOTE: Workaround when no lang in current path
    // fallback to current i81n language ...
    lang = i18n.language.split('-')[0]
  }

  if (typeof to === 'string') {
    return namespacePath(to, forceLanguage ?? lang)
  } else {
    return {
      ...to,
      pathname: namespacePath(to.pathname, forceLanguage ?? lang),
    }
  }
}

export {
  initializeI18next,
  useToWithLang
}
