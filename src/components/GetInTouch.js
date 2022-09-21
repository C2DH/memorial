import React from 'react'
import { useTranslation } from 'react-i18next'

const GetInTouch = ({ emailSubjectTranslationLabel = 'getInTouchSubject' }) => {
  const { t } = useTranslation()
  const href = `mailto:${process.env.REACT_APP_EMAIL}?subject=${encodeURIComponent(
    t(emailSubjectTranslationLabel),
  )}`

  return (
    <a className="GetInTouch btn btn-primary" href={href} target="_blank" rel="noreferrer">
      {t('actionSendUsPageOfTestimony')}
    </a>
  )
}

export default GetInTouch
