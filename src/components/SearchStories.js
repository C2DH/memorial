import { useStories } from '@c2dh/react-miller'
import { useTranslation } from 'react-i18next'
import StoryItem from '../components/StoryItem'
import { StatusSuccess, useGetJSON } from '../hooks/data'

import '../styles/components/SearchStories.css'

const SearchStories = ({ q = '', filters = {}, limit = 20, orderby = '-id' }) => {
  const { t } = useTranslation()
  const { data, status, error } = useGetJSON({
    url: '/api/story',
    params: {
      exclude: {
        tags__slug: 'static',
      },
      filters,
      q,
    },
  })
  const count = data?.count
  const stories = data?.results

  return (
    <ol className="SearchStories">
      {status === StatusSuccess && count === 0 && <li>{t('noResults')}</li>}
      {status === StatusSuccess &&
        count > 0 &&
        stories.map((story, i) => (
          <li key={story.slug} className="mt-2 ">
            <label className="small text-muted">
              {i + 1} / {count}
            </label>
            <StoryItem story={story} />
          </li>
        ))}
    </ol>
  )
}

export default SearchStories
