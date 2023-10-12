import './MetadataField.css'
import { useTranslation } from 'react-i18next'

const MetadataField = ({ label, value, className = '', hideIfEmpty = false }) => {
  var { t } = useTranslation()

  if (
    hideIfEmpty &&
    (typeof value === 'undefined' ||
      value === null ||
      (typeof value === 'string' && value.length === 0))
  ) {
    return null
  }
  const valueAsDate = new Date(value)

  return (
    <div className={`MetadataField ${className}`}>
      <label>{t('metadataField_' + label)}</label>
      {typeof value === 'undefined' || value === null ? <span>&mdash;</span> : null}
      {typeof value === 'string' && value.length === 0 ? <span>&mdash;</span> : null}
      {typeof value === 'string' && isNaN(valueAsDate) && value.length > 0 ? (
        <span>{value}</span>
      ) : null}
      {typeof value === 'string' && !isNaN(valueAsDate) ? (
        <span>{t('dateShort', { date: valueAsDate })}</span>
      ) : null}
      {Array.isArray(value) ? value.map((v, i) => <span key={i}>{v}</span>) : null}
    </div>
  )
}

export default MetadataField
