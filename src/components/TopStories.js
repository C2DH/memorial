import React from 'react'
import StoryItem from './StoryItem'
import { StatusError, StatusSuccess, useGetJSON } from '../hooks/data'
import { shuffle } from '../logic/array'
import '../styles/components/TopStories.css'

const TopStories = ({ params = {}, children, allStories = false }) => {
  const { data, status, error } = useGetJSON({
    url: '/api/story',
    params,
  })

  if (status === StatusError) {
    console.error('TopStories error in reading api:', status, data, error)
    return null
  }

  return (
    <aside className="TopStories">
      {children}

      <ol>
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
