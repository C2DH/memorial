import DocumentItem from './DocumentItem'

import { StatusError, StatusSuccess, useGetJSON } from '../hooks/data'

const ListOfDocuments = ({ params, className = '', hideIfEmpty, onClick, itemProps, children }) => {
  const { data, status, error } = useGetJSON({
    url: '/api/document',
    params,
  })

  if (status === StatusError) {
    console.error('[ListOfDocuments] error in reading api:', status, params, data, error)
    return null
  }
  if (status === StatusSuccess && !data.results.length && hideIfEmpty) {
    return null
  }

  return (
    <section className={`ListOfDocuments ${className}`}>
      {children}
      <ol>
        {status === StatusSuccess
          ? data.results.map((doc) => (
              <li key={doc.slug}>
                <DocumentItem doc={doc} onClick={onClick} {...itemProps} />
              </li>
            ))
          : null}
      </ol>
    </section>
  )
}

export default ListOfDocuments
