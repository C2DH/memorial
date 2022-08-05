import { useStories } from '@c2dh/react-miller'
import StoryItem from '../components/StoryItem'

import '../styles/components/SearchStories.css'

const SearchStories = ({ q = '', filters = {}, limit = 20, orderby = '-id' }) => {
  const [data, { isSuccess }] = useStories({
    params: {
      exclude: {
        tags__slug: 'static',
      },
    },
    suspense: false,
  })
  const { count, results: stories } = data ? data : {}
  return (
    <ol className="SearchStories">
      {isSuccess && count === 0 && <li>No results.</li>}
      {isSuccess &&
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
