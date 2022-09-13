import React from 'react'
import { useDate } from '../hooks/date'

const DocumentDate = ({
  doc,
  language,
  references = [],
  separator = null,
  className = '',
  children,
  ...rest
}) => {
  const { parseDate } = useDate({ language })
  console.info('[DocumentDate]', doc.slug, references)
  if (!doc || !doc.data || !doc.data.start_date) {
    return (
      <span className={`DocumentDate ${className}`} {...rest}>
        {children}
      </span>
    )
  }

  const hasEndDate =
    typeof doc.data.end_date === 'string' && doc.data.end_date !== doc.data.start_date

  if (hasEndDate) {
    // over one year?
    const startDate = new Date(doc.data.start_date)
    const endDate = new Date(doc.data.end_date)
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24)

    if (days > 365) {
      return (
        <>
          <span className={`DocumentDate ${className}`} {...rest}>
            {startDate.getFullYear()} &mdash; {endDate.getFullYear()}
          </span>
          {typeof separator === 'string' && <>&nbsp;{separator}&nbsp;</>}
        </>
      )
    } else if (days > 30) {
      // Only months
    }
  }
  return (
    <>
      <span className={`DocumentDate ${className}`} {...rest}>
        {parseDate(doc.data.start_date)}
        {hasEndDate && <span> &mdash; {parseDate(doc.data.end_date)}</span>}
      </span>
      {typeof separator === 'string' && <>&nbsp;{separator}&nbsp;</>}
    </>
  )
}

export default DocumentDate
