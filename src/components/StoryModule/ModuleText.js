import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { all } from 'mdast-util-to-hast'
import FootnoteReference from './FootnoteReference'
import FootnoteDefinition from './FootnoteDefinition'
import ModuleTextAnchor, {
  FootnoteReferencePrefix,
  FootnoteDefinitionPrefix,
} from './ModuleTextAnchor'

const ModuleText = ({ content = '', language, footnotes = [], printFootnotes = true }) => {
  // console.debug('[ModuleText]', content, footnotes)
  // remove {width=} image
  // and correct badly retrieved markdown errors
  // console.debug('[ModuleText]', markdownParser.render(content), footnotes)
  let chunks = [
    content
      // replace image spec {width= ...} (sic)
      .replace(/\{width=[^}]+\}/g, '')
      // replace {.smallcaps}
      .replace(/\[([^\]]+)\]\{\.[^}]+\}/g, (m, t) => t)
      // replace {.underline} mentions (sic)
      .replace(/\{\.[^}]+\}/g, '')
      // replace weird list item: e:g am\n29. Juli 1947 MUST NOT BE A LIST
      .replace(/([^.])\n(\d+)\./g, (m, dot, num) => `. ${num}.`)
      // replace /1 with [^1]
      .replace(/[\\/](\d{1,3})[^\d]/g, (m, num) => `[${num}](${FootnoteReferencePrefix}/${num})`)
      // replace footnotes and their references
      .replace(/\[\^(\d+)\](:)?/g, (m, num, def) => {
        return def === undefined
          ? `[${num}](${FootnoteReferencePrefix}/${num})`
          : `[${num}](${FootnoteDefinitionPrefix}/${num})`
      }), // VERY IMPORTANT, we build FAKE footnotes! as we hve now sections.
  ]
  // console.debug('[ModuleText]', chunks)
  const footnoteIndex = {}
  // if (footnotes.length) {
  //   // add to markdown contents
  //   chunks = chunks.concat(
  //     footnotes.map((d) => {
  //       footnoteIndex[d.id] = d
  //       return `[^${d.id}]: ${d.text}`
  //     }),
  //   )
  // }

  return (
    <ReactMarkdown
      components={{
        footnoteReference: FootnoteReference,
        footnoteDefinition: FootnoteDefinition,
        a: ModuleTextAnchor,
      }}
      remarkRehypeOptions={{
        footnoteLabel: 'Voetnoten',
        footnoteBackLabel: 'Terug',
        handlers: {
          footnoteDefinition: (h, node) => {
            // console.debug('[remarkRehypeOptions] footnoteDefinition', node, footnotes)
            return h(
              node,
              'footnoteDefinition',
              {
                identifier: node.identifier,
                label: node.label,
                footnote: footnoteIndex[node.identifier],
              },
              all(h, node),
            )
          },
          footnoteReference: (h, node) => {
            // console.debug('[remarkRehypeOptions]', node)
            return h(node, 'footnoteReference', {
              identifier: node.identifier,
              label: node.label,
              footnote: footnotes.find(({ id }) => node.identifier === String(id)),
            })
          },
        },
      }}
      remarkPlugins={[remarkGfm]}
    >
      {chunks.join('\n\n')}
    </ReactMarkdown>
  )
}

export default ModuleText
