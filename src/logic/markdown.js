import MarkdownIt from 'markdown-it'


const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

export const render = (source) => {
  return markdownParser.render(source)
}
