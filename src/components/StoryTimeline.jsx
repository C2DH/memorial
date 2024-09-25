import React from 'react'
import DocumentItem from './DocumentItem'
import '../styles/components/StoryTimeline.css'
import { StatusSuccess, useGetJSON } from '../hooks/data'

const StoryTimeline = ({ storyId }) => {
  const { data, status, error } = useGetJSON({
    url: `/api/document/`,
    params: {
      limit: 1000,
      filters: { slug__istartswith: storyId },
      orderby: 'slug',
    },
    delay: 1000,
  })
  if (error) {
    console.warn('[StoryTimeline] error:', error)
  }

  let dates = [
    { t: 1915, label: '' },
    { t: 1918, label: '' },
    { t: 1939, label: '' },
    { t: 1945, label: '' },
  ]

  let documentWithoutDates = []
  let allDates = []
  if (status === StatusSuccess) {
    // add timeline values
    data.results
      .filter((d) => typeof d.data.start_date === 'string')
      .forEach((d) => {
        const documentDate = new Date(d.data.start_date)
        const year = documentDate.getFullYear()
        const idx = dates.findIndex((d) => d.t === year)
        if (idx === -1) {
          dates.push({
            t: year,
            docs: [d],
          })
        } else if (Array.isArray(dates[idx].docs)) {
          dates[idx].docs.push(d)
        } else {
          dates[idx].docs = [d]
        }
      })
    // sort by year
    dates.sort((a, b) => a.t - b.t)
    // fill remaining dates
    const interval = dates[dates.length - 1].t - dates[0].t
    allDates = Array.apply(null, Array(interval + 1)).map(function (_, i) {
      const t = dates[0].t + i
      const idx = dates.findIndex((d) => d.t === t)
      if (idx === -1) {
        return { t, relevant: t % 10 === 0 }
      }
      return dates[idx]
    })
    // fill list with uncertain dates
    documentWithoutDates = data.results.filter((d) => typeof d.data.start_date !== 'string')
  }
  return (
    <aside className="StoryTimeline">
      <ol className="mb-4">
        {allDates.map((value) => {
          if (Array.isArray(value.docs) && value.docs.length) {
            return (
              <li key={value.t} className="StoryTimeline_withDocs">
                <h4>{value.t}</h4>
                <ol>
                  {value.docs.map((doc) => (
                    <li key={doc.id}>
                      <DocumentItem doc={doc} />
                    </li>
                  ))}
                </ol>
              </li>
            )
          } else if (typeof value.label === 'string') {
            return (
              <li key={value.t} className="StoryTimeline_emptyYearLabeled">
                <label>{value.t}</label>
              </li>
            )
          } else if (value.relevant) {
            return (
              <li key={value.t} className="StoryTimeline_decadeYear">
                <label>{value.t}</label>
              </li>
            )
          } else {
            return <li key={value.t} className="StoryTimeline_emptyYear" title={value.t} />
          }
        })}
      </ol>
      <ol className="StoryTimeline_unknownDate">
        {documentWithoutDates.map((doc) => {
          return (
            <li key={doc.id}>
              <DocumentItem doc={doc} />
            </li>
          )
        })}
      </ol>
    </aside>
  )
}

export default StoryTimeline
