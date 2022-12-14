import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useQueryParams, withDefault } from 'use-query-params'
import { QParam, SlugParam, createEnumParam } from '../logic/params'
import StoryItem from '../components/StoryItem'
import { BootstrapStartColumnLayout, BootstrapEndColumnLayout } from '../constants'
import { useTranslation } from 'react-i18next'
import SearchField from '../components/SearchField'
import { StatusSuccess, useGetJSON } from '../hooks/data'
import Author from '../components/Author'
import authorIndex from '../data/authors.json'
import { X } from 'react-feather'
import '../styles/pages/Biographies.css'
import OrderByDropdown from '../components/OrderByDropdown'

const OrderByLatestModifiedFirst = '-date_last_modified'
const OrderByOldestModifiedFirst = 'date_last_modified'
const OrderByLatestCreatedFirst = '-date_created'
const OrderByOldestCreatedFirst = 'date_created'

const AvailableOrderBy = [
  {
    value: OrderByLatestModifiedFirst,
    label: 'orderByLatestModifiedFirst',
  },
  {
    value: OrderByOldestModifiedFirst,
    label: 'orderByOldestModifiedFirst',
  },
  {
    value: OrderByLatestCreatedFirst,
    label: 'orderByLatestCreatedFirst',
  },
  {
    value: OrderByOldestCreatedFirst,
    label: 'orderByOldestCreatedFirst',
  },
]

const AvailableOrderByValues = AvailableOrderBy.map((d) => d.value)

const Biographies = () => {
  const { t } = useTranslation()
  const [{ q, orderBy, author }, setQuery] = useQueryParams({
    q: withDefault(QParam, ''),
    orderBy: withDefault(createEnumParam(AvailableOrderByValues), OrderByLatestCreatedFirst),
    author: withDefault(SlugParam, ''),
  })
  const authorMetadata = authorIndex[author]
  const filters = {}
  if (author.length) {
    filters.authors__slug = author
  }
  if (q.length > 2) {
    filters.title__icontains = q.toLowerCase()
  }
  const { data, status, error } = useGetJSON({
    url: '/api/story',
    params: {
      exclude: {
        tags__slug: 'static',
      },
      limit: 100,
      facets: ['author'],
      orderby: orderBy,
      filters,
    },
  })

  const count = data?.count
  let stories = data?.results || []

  if (error) {
    console.warn('[SearchStories] error:', error)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [orderBy, author, q])

  return (
    <div className="Biographies page">
      <Container>
        <Row className="d-flex align-items-baseline">
          <Col {...BootstrapStartColumnLayout}>
            <h1>{t('pagesBiographiesTitle')}</h1>
            {status === StatusSuccess && count === 0 && <li>{t('noResults')}</li>}
            {status === StatusSuccess && count > 0 && (
              <div className="Biographies_summary">
                {q.length === 0 && (
                  <>
                    {authorMetadata ? (
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: t('biographiesCountWithAuthor', {
                              n: count,
                              q,
                              author: authorMetadata.fullname,
                            }),
                          }}
                        />
                        <button
                          onClick={() => setQuery({ author: undefined })}
                          className="btn btn-transparent d-inline p-0 btn-sm"
                        >
                          <X />
                        </button>
                      </p>
                    ) : (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: t('biographiesCount', { n: count, q }),
                        }}
                      />
                    )}
                  </>
                )}
                {q.length > 0 && (
                  <>
                    {authorMetadata ? (
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: t('biographiesCountWithQueryAndAuthor', {
                              n: count,
                              q,
                              author: authorMetadata.fullname,
                            }),
                          }}
                        />
                        <button
                          onClick={() => setQuery({ author: undefined })}
                          className="btn btn-transparent d-inline p-0 btn-sm"
                        >
                          <X />
                        </button>
                      </p>
                    ) : (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: t('biographiesCountWithQuery', { n: count, q }),
                        }}
                      />
                    )}
                  </>
                )}
                <OrderByDropdown
                  values={AvailableOrderBy}
                  selectedValue={orderBy}
                  onChange={(item) => {
                    setQuery({ orderBy: item.value })
                  }}
                />
              </div>
            )}
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <SearchField
              status={status}
              defaultValue={q}
              onSubmit={(e, value) => setQuery({ q: value })}
            />
          </Col>
        </Row>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <ol>
              {status === StatusSuccess &&
                count > 0 &&
                stories.map((story, i) => (
                  <li key={story.slug} className="mt-5 ">
                    {/* <label className="small text-muted">
              {i + 1} / {count}
            </label> */}
                    <StoryItem story={story} />
                  </li>
                ))}
            </ol>
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            {author.length > 0 && <Author className="mt-3" author={{ slug: author }} />}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Biographies
