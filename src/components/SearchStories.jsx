import { useTranslation } from 'react-i18next'
import StoryItem from '../components/StoryItem'
import { StatusSuccess, useGetJSON } from '../hooks/data'

import '../styles/components/SearchStories.css'

const SearchStories = ({ filters = {}, limit = 20, orderby = '-id' }) => {
  const { t } = useTranslation()
  const { data, status, error } = useGetJSON({
    url: '/api/story',
    params: {
      exclude: {
        tags__slug: 'static',
      },
      limit,
      // ...params,
      filters,
      orderby,
      // q,
    },
  })
  const count = data?.count
  const stories = data?.results

  if (error) {
    console.warn('[SearchStories] error:', error)
  }
  return (
    <ol className="SearchStories">
      {status === StatusSuccess && count === 0 && <li>{t('noResults')}</li>}
      {status === StatusSuccess && count > 0 && (
        <li>
          <p dangerouslySetInnerHTML={{ __html: t('biographiesCount', { n: count }) }} />
        </li>
      )}
      {status === StatusSuccess &&
        count > 0 &&
        stories.map((story, i) => (
          <li key={story.slug} className="mt-5 ">
            {/* <label className="small text-muted">
              {i + 1} / {count}
            </label> */}
            <StoryItem story={story} />
          </li>
        ))}
    </ol>
  )
}

export default SearchStories
