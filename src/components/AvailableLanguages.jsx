import { LanguageCodes, MillerLanguages } from '../constants'
import { useTranslation } from 'react-i18next'

const AvailableLanguages = ({
  languages = [],
  labelIfEmpty = 'withoutTranslations',
  labelifTranslated = 'translatedIn',
  className = '',
}) => {
  const { t } = useTranslation()
  return (
    <div className={className}>
      {languages.length > 0 ? (
        <>
          <label>{t(labelifTranslated)}</label>&nbsp;
          {LanguageCodes.map((d, i) => {
            const disabled = !languages.includes(MillerLanguages[i])
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
        </>
      ) : (
        <div className="fst-italic">{t(labelIfEmpty)}</div>
      )}
    </div>
  )
}
export default AvailableLanguages
