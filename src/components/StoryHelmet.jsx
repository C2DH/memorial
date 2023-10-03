import { useEffect } from 'react'
import HelmetItem from './HelmetItem'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

const StoryHelmet = ({ story, language }) => {
  const { t } = useTranslation()
  useEffect(() => {
    console.debug('[StoryHelmet] @useEffect language:', language)
    document.dispatchEvent(
      new Event('ZoteroItemUpdated', {
        bubbles: true,
        cancelable: true,
      }),
    )
  }, [language])

  let title = ''
  let description = ''
  let cover = ''

  try {
    title = story.data.title[language]
    description = story.contents.modules[0].text.content[language]
    cover =
      story.covers.length > 0
        ? String(import.meta.env.VITE_ORIGIN + story.covers[0].data?.resolutions?.medium?.url)
        : '/screen.png'
  } catch (error) {
    console.warn('[Storyhelmet] error in rendering, skipping. ', error)
    return null
  }

  // remove first markdown pqrqgrqph from description as it is normally the same as the title
  description = description.replace(/^#.*$/gm, '')
  // remove all markdown links
  description = description.replace(/\[.*?\]\(.*?\)/gm, '')
  // remove all markdown footnotes references [^2]
  description = description.replace(/\[\^.*?\]/gm, '')
  // remove other markdown markup
  description = description.replace(/[*_`]/gm, '')
  // remove all html tags
  description = description.replace(/<[^>]*>?/gm, '')
  // remove all html entities
  description = description.replace(/&[^;]*;/gm, '')

  // remove all line breaks
  description = description.replace(/\n+/gm, '\n')
  // remove all double spaces
  description = description.replace(/\s+/gm, ' ')

  // generate exccerpt of 280 characters max, then go to the last punctuation mark and add dots if necessary
  if (description.length > 380) {
    // Truncate to 280 characters
    description = description.substring(0, 380)
    // Cut to last punctuation mark
    description = description.substring(0, description.lastIndexOf('.'))
    // Add dots
    description += '...'
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="dc:title" content={title} />
      <meta name="dc:publisher" content="C2DH - University of Luxembourg" />
      <meta property="og:site_name" content="memorialshoah.lu" />
      <meta property="og:url" content={import.meta.env.VITE_ORIGIN + window.location.pathname} />
      <meta property="og:title" content={title} />
      <meta name="twitter:site" content="@memorialshoahlu" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {cover.length > 0 ? <meta name="twitter:image" content={cover} /> : null}
      {cover.length > 0 ? <meta property="og:image" content={cover} /> : null}
      <meta name="twitter:label1" content={t('publicationDate')} />
      <meta name="twitter:data1" content={t('dateShort', { date: new Date(story.date_created) })} />
      <meta name="twitter:label2" content={t('writtenBy')} />
      <meta name="twitter:data2" content={story.authors.map((a) => a.fullname).join(', ')} />
      <HelmetItem property="og:description" value={description} />
      {story.authors.map((author) => (
        <HelmetItem key={author.id} property="article:author" value={author.fullname} />
      ))}
      <HelmetItem property="article:published_time" value={story.date_created} />
      <meta property="og:type" content="article" />
      <meta property="og:locale" content={language} />
    </Helmet>
  )
}

export default StoryHelmet
