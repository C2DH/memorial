import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useQueryParam, withDefault } from 'use-query-params'
import { QParam, SlugParam } from '../logic/params'
import StoryItem from '../components/StoryItem'
import { BootstrapStartColumnLayout, BootstrapEndColumnLayout } from '../constants'
import { useTranslation } from 'react-i18next'
import SearchField from '../components/SearchField'
import { StatusSuccess, useGetJSON } from '../hooks/data'
import Author from '../components/Author'
import authorIndex from '../data/authors.json'
import { X } from 'react-feather'
import '../styles/pages/Biographies.css'

const Biographies = () => {
  const { t } = useTranslation()
  const [q, setQuery] = useQueryParam('q', withDefault(QParam, ''))
  const [authorSlug, setAuthorSlug] = useQueryParam('author', withDefault(SlugParam, ''))
  const authorMetadata = authorIndex[authorSlug]
  const filters = {}
  if (authorSlug.length) {
    filters.authors__slug = authorSlug
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
      orderby: '-id',
      filters,
    },
  })

  const count = data?.count
  const stories = data?.results

  if (error) {
    console.warn('[SearchStories] error:', error)
  }

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
                          onClick={() => setAuthorSlug(undefined)}
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
                          onClick={() => setAuthorSlug(undefined)}
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
              </div>
            )}
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <SearchField
              status={status}
              defaultValue={q}
              onSubmit={(e, value) => setQuery(value)}
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
            {authorSlug.length > 0 && <Author className="mt-3" author={{ slug: authorSlug }} />}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Biographies
