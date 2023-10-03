import { LanguagePathRegExp } from '../../constants'
import LangLink from '../LangLink'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'

export const FootnoteReferencePrefix = 'fnref'
export const FootnoteDefinitionPrefix = 'fndef'
/**
 * Component to integrate ReactMarkdown specs
 */
const ModuleTextAnchor = ({ children, href, ...props }) => {
  const textNode = children
    .map((child) => String(child))
    .join('')
    .replace('[', '')
    .replace(']', '')
  // check if the item is a footnote definition
  if (href.indexOf(FootnoteReferencePrefix) === 0) {
    return (
      <>
        <span className="anchor" id={[FootnoteReferencePrefix, textNode].join('-')}></span>
        <Link
          className="ModuleTextAnchor Reference"
          to={`#${[FootnoteDefinitionPrefix, textNode].join('-')}`}
        >
          {textNode}
        </Link>
      </>
    )
  }
  if (href.indexOf(FootnoteDefinitionPrefix) === 0) {
    return (
      <>
        <span className="anchor" id={[FootnoteDefinitionPrefix, textNode].join('-')}></span>
        <Link
          className="ModuleTextAnchor Definition"
          to={`#${[FootnoteReferencePrefix, textNode].join('-')}`}
        >
          <ArrowLeft /> {textNode}
        </Link>
      </>
    )
  }
  // check if href is the website one (internal links)
  if (href.indexOf(import.meta.env.VITE_ORIGIN) !== -1) {
    // remove origin, e.g. `https://` and language `/en/` from the href to make page specific
    const to = href.replace(import.meta.env.VITE_ORIGIN, '').replace(LanguagePathRegExp, '')
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
