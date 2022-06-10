import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * @param {{ to: string }} props
 */
export default function LangLink({ to, ...props }) {
  const { i18n } = useTranslation()
  return <Link {...props} to={`${i18n.language.split('-').shift().toLowerCase()}${to}`} />
}
