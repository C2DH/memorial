import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * @param {{ to: string }} props
 */
export default function LangLink({ to, language, disabled, children, onClick, ...props }) {
  const { i18n } = useTranslation()
  const url = language
    ? `/${language}${to}`
    : `/${i18n.language.split('-').shift().toLowerCase()}${to}`
  // console.debug('[LangLink] to:', to, 'url:', url)
  if (disabled) {
    return <del {...props}>{children}</del>
  }
  const onClickHandler = (e) => {
    console.debug('[LangLink] typeof onClick', typeof onClick)
    if (typeof onClick === 'function') {
      onClick(e)
    }
  }
  return <Link {...props} to={url} onClick={onClickHandler} children={children} />
}
