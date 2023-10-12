import { useState } from 'react'
import SearchField from '../../SearchField'
import { useGetJSON } from '../../../hooks/data'
import './SelectStory.css'
import { Dropdown } from 'react-bootstrap'
import StoryItem from '../../StoryItem'

const SelectStory = ({ stories = [], onSelect }) => {
  const [q, set] = useState('')
  const params = {
    limit: 5,
    exclude: {
      tags__slug__in: ['static', 'convoy'],
    },
    orderby: '-date_last_modified',
  }

  if (q.length > 1) {
    params.q = q + '*'
  }

  const { data, status, error } = useGetJSON({
    url: '/api/story',
    params,
  })
  const handleSearchFieldSubmit = (e, value) => {
    console.debug('[SelectStory] handleSearchFieldSubmit', value)
    set(value)
  }
  console.debug('[SelectStory] data:', data, '\n - status:', status, '\n - error:', error, params)
  return (
    <div className="SelectStory position-relative">
      <SearchField
        className="mt-0"
        onSubmit={handleSearchFieldSubmit}
        status={status}
      ></SearchField>
      {/* <div className="SelectStory__results">
        {data?.results?.map((story) => (
          <StoryItem key={story.slug} story={story} reduced />
        ))}
      </div> */}
    </div>
  )
}

export default SelectStory
