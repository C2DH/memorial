import React from 'react'
import { LanguagePathRegExp } from '../../constants'
import LangLink from '../LangLink'

/**
 * Component to integrate ReactMarkdown specs
 */
const ModuleTextAnchor = ({ node, children, href, ...props }) => {
  console.debug(children, props)

  // check if href is the website one (internal links)
  if (href.indexOf(process.env.REACT_APP_ORIGIN) !== -1) {
    const textNode = children
      .map((child) => String(child))
      .join('')
      .replace('[', '')
      .replace(']', '')
    // remove origin, e.g. `https://` and language `/en/` from the href to make page specific
    const to = href.replace(process.env.REACT_APP_ORIGIN, '').replace(LanguagePathRegExp, '')
    return (
      <LangLink className="ModuleTextAnchor" to={to} {...props}>
        {textNode}
      </LangLink>
    )
  }
  return (
    <i style={{ color: 'red' }} {...props}>
      {children.map((child, i) => (
        <React.Fragment key={i}>{child}</React.Fragment>
      ))}
    </i>
  )
}

export default ModuleTextAnchor
