import { useParams } from 'react-router-dom'
import { useGetJSON } from '../hooks/data'
import { useAvailableLanguage } from '../hooks/language'

const Slides = () => {
  const { pageId } = useParams()
  const { data: page } = useGetJSON({
    url: `/api/story/${pageId.replace(/[^\dA-Za-z-_]/g, '')}/`,
  })

  const { availableLanguage } = useAvailableLanguage({
    translatable: page?.data?.title,
  })

  if (!page) return null

  const title = page.data.title[availableLanguage]
  const subtitle = page.data.subtitle[availableLanguage]
  const abstract = page.data.abstract[availableLanguage]

  return (
    <div>
      <h1>Slides </h1>

      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <p>{abstract}</p>
    </div>
  )
}
export default Slides
