import { useStories } from '@c2dh/react-miller'
import LangLink from '../components/LangLink'

import '../styles/components/SearchStories.css'

const SearchStories = () => {
  const [data] = useStories({
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
      {Array.isArray(stories) &&
        stories.map((s, i) => (
          <li key={s.slug}>
            <label class="small text-muted">
              {i + 1} / {count}
            </label>
            <h2>
              <LangLink to={`/story/${s.slug}`}>{s.data.title || s.slug}</LangLink>
            </h2>
            {/* <pre>{JSON.stringify(s, null, 2)}</pre> */}
            <p>{s.data.abstract}</p>
          </li>
        ))}
    </ol>
  )
}

export default SearchStories
