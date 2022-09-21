import React from 'react'
import { LanguagePathRegExp } from '../../constants'
import LangLink from '../LangLink'

/**
 * Component to integrate ReactMarkdown specs
 */
const ModuleTextAnchor = ({ node, children, href, ...props }) => {
  const textNode = children
    .map((child) => String(child))
    .join('')
    .replace('[', '')
    .replace(']', '')
  // check if href is the website one (internal links)
  if (href.indexOf(process.env.REACT_APP_ORIGIN) !== -1) {
    // remove origin, e.g. `https://` and language `/en/` from the href to make page specific
    const to = href.replace(process.env.REACT_APP_ORIGIN, '').replace(LanguagePathRegExp, '')
    return (
      <LangLink className="ModuleTextAnchor" to={to} {...props}>
        {textNode}
      </LangLink>
    )
  }
  return (
    <a href={href} {...props} target="_blank" rel="noreferrer noopener">
      {textNode}
    </a>
  )
}

export default ModuleTextAnchor
