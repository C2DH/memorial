import React from 'react'
import { useTranslation } from 'react-i18next'
import StoryItem from './StoryItem'
import LangLink from './LangLink'
import { StatusError, StatusSuccess, useGetJSON } from '../hooks/data'
import { shuffle } from '../logic/array'
import '../styles/components/TopStories.css'

const TopStories = () => {
  const { t } = useTranslation()
  const { data, status, error } = useGetJSON({
    url: '/api/story',
    params: {
      exclude: { tags__name: 'static' },
    },
  })

  if (status === StatusError) {
    console.error('TopStories error in reading api:', status, data, error)
    return null
  }

  return (
    <aside className="TopStories">
      <p dangerouslySetInnerHTML={{ __html: t('topStoriesIntro') }} />
      <LangLink to="/search/stories">{t('AllStories')}</LangLink>
      <ol className="border-top border-dark mt-3">
        {status === StatusSuccess
          ? shuffle(data.results).map((story) => (
              <li key={story.slug}>
                <StoryItem story={story} className="my-3" />
              </li>
            ))
          : null}
      </ol>
    </aside>
  )
}

export default TopStories
