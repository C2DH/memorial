import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * @param {{ to: string }} props
 */
export default function LangLink({ to, ...props }) {
  const { i18n } = useTranslation()
  const url = `/${i18n.language.split('-').shift().toLowerCase()}${to}`
  // console.debug('[LangLink] to:', to, 'url:', url)
  return <Link {...props} to={url} />
}
