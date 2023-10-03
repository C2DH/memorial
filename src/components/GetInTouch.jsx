import { useTranslation } from 'react-i18next'

const GetInTouch = ({ emailSubjectTranslationLabel = 'getInTouchSubject' }) => {
  const { t } = useTranslation()
  const href = `mailto:${import.meta.env.VITE_EMAIL}?subject=${encodeURIComponent(
    t(emailSubjectTranslationLabel),
  )}`

  return (
    <a className="GetInTouch btn btn-white btn-lg" href={href} target="_blank" rel="noreferrer">
      {t('actionSendUsPageOfTestimony')}
    </a>
  )
}

export default GetInTouch
