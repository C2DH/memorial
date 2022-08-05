import React from 'react'
import DocumentItem from './DocumentItem'
import { StatusError, StatusSuccess, useGetJSON } from '../hooks/data'
import { shuffle } from '../logic/array'
import '../styles/components/TopDocuments.css'

const TopDocuments = ({ params = {}, children, label, allStories = false, onClick }) => {
  const { data, status, error } = useGetJSON({
    url: '/api/document',
    params,
  })

  if (status === StatusError) {
    console.error('TopDocuments error in reading api:', status, data, error)
    return null
  }

  return (
    <aside className="TopDocuments">
      {children}
      <div className="TopDocuments_verticalLabel">{label}</div>
      <ol>
        {status === StatusSuccess
          ? shuffle(data.results).map((doc) => (
              <li key={doc.slug}>
                <DocumentItem doc={doc} onClick={onClick} />
              </li>
            ))
          : null}
      </ol>
    </aside>
  )
}

export default TopDocuments
