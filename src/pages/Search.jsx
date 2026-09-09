import { useQueryParams, withDefault } from 'use-query-params'
import { QParam, SlugParam, createEnumParam } from '../logic/params'
import {
  BiographiesAvailableOrderBy,
  BiographiesAvailableOrderByValues,
  BootstrapEndColumnLayout,
  BootstrapStartColumnLayout,
  LanguageCodes,
  OrderByLatestCreatedFirst,
  OrderByRelevance,
} from '../constants'
import { useEffect, useRef, useState } from 'react'
import PagefindMatch from '../components/PagefindMatch'
import { Col, Container, Row } from 'react-bootstrap'
import SearchField from '../components/SearchField'
import { StatusFetching, StatusIdle, StatusSuccess } from '../hooks/data'
import { usePagefind } from '../hooks/usePagefind'
import { useTranslation } from 'react-i18next'
import OrderByDropdown from '../components/OrderByDropdown'
import StoryAuthors from '../components/StoryAuthors'
import SearchSummary from '../components/SearchSummary'
import { useStore } from '../store'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import StoryItem from '../components/StoryItem'
import Author from '../components/Author'
import GenericIntersectionObserver from '../components/GenericIntersectionObserver'
import './Search.css'

const Search = ({ limit = 5 }) => {
  const { t, i18n } = useTranslation()
  const activeLanguageCode = i18n.language.split('-').shift().toLowerCase()
  const authorIndex = useStore((state) => state.authorsIndex)
  const { pagefindRef, isSearchReady } = usePagefind()
  const [pagefindResult, setPagefindResult] = useState({ status: StatusIdle, matches: [] })
  // read raw URL once so a shared link with an explicit orderBy is never overridden
  const initialUrlParams = useRef(new URLSearchParams(window.location.search)).current
  const hasManuallySetOrderByRef = useRef(initialUrlParams.has('orderBy'))
  const initialOrderByDefault =
    !initialUrlParams.has('orderBy') && (initialUrlParams.get('q') ?? '').length > 0
      ? OrderByRelevance
      : OrderByLatestCreatedFirst
  const [{ q, lang, orderBy, author }, setQuery] = useQueryParams({
    q: withDefault(QParam, ''),
    lang: withDefault(createEnumParam(LanguageCodes), activeLanguageCode),
    orderBy: withDefault(createEnumParam(BiographiesAvailableOrderByValues), initialOrderByDefault),
    author: withDefault(SlugParam, ''),
  })
  const prevQRef = useRef(q)
  const isSearchEnabled = q.length > 1 && isSearchReady
  const queryParams = {}
  if (author.length) {
    queryParams.filters = {
      authors__slug: author,
    }
  }
  // relevance only has meaning to pagefind; the CMS needs a real sort field
  const restOrderBy = orderBy === OrderByRelevance ? OrderByLatestCreatedFirst : orderBy
  const {
    fetchNextPage,
    // fetchPreviousPage,
    hasNextPage,
    // hasPreviousPage,
    // isFetchingNextPage,
    // isFetchingPreviousPage,
    data,
    status: queryStatus,
    // ...result
  } = useInfiniteQuery({
    queryKey: ['biographies', author, activeLanguageCode, restOrderBy],
    queryFn: ({ pageParam = 1 }) =>
      axios
        .get('/api/story', {
          timeout: 30000, // 30 seconds
          // onDownloadProgress,
          params: {
            limit,
            orderby: restOrderBy,
            exclude: {
              tags__slug__in: ['static', 'convoy'],
            },
            ...queryParams,
            offset: limit * (pageParam - 1),
          },
        })
        .then((res) => {
          const response = {
            results: res.data.results,
            count: res.data.count,
            nextCursor: pageParam + 1,
          }
          console.debug(
            '[Search] useInfiniteQuery \n - response:',
            response,
            '\n - params:',
            res.config.params,
          )
          return response
        }),
    // ...options,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: q.length === 0,
  })
  const count = isSearchEnabled ? pagefindResult.matches.length : data?.pages[0].count
  // relevance is meaningless while browsing without a query, so hide it from the dropdown
  const orderByOptions = isSearchEnabled
    ? BiographiesAvailableOrderBy
    : BiographiesAvailableOrderBy.filter((d) => d.value !== OrderByRelevance)

  // auto-switch orderBy to/from relevance when a search starts/ends, unless the user chose one explicitly
  useEffect(() => {
    if (!hasManuallySetOrderByRef.current) {
      if (prevQRef.current.length === 0 && q.length > 0) {
        setQuery({ orderBy: OrderByRelevance })
      } else if (prevQRef.current.length > 0 && q.length === 0) {
        setQuery({ orderBy: OrderByLatestCreatedFirst })
      }
    }
    prevQRef.current = q
  }, [q, setQuery])

  const onIntersectHandler = () => {
    console.debug('[Search] onIntersectHandler \n - hasNextPage:', hasNextPage)
    console.info('onIntersectHandler', hasNextPage)
    fetchNextPage()
  }
  useEffect(() => {
    window.scrollTo(0, 0)
    if (!isSearchEnabled) {
      return
    }
    setPagefindResult({ status: StatusFetching, matches: [] })
    console.info('[Search] Pagefind search', { q, orderBy, author }, 'with lang:', lang)
    async function fetchData() {
      await pagefindRef.current.options({
        language: lang,
      })
      pagefindRef.current.init()
      const filters = await pagefindRef.current.filters()
      console.info('[Search] Pagefind search possible filters', filters)
      const orderByEntry = BiographiesAvailableOrderBy.find(({ value }) => value === orderBy)
      const params = { filters: {} }
      // omit sort for relevance so pagefind uses its native score ranking
      if (orderByEntry.sort) {
        params.sort = orderByEntry.sort
      }
      if (author.length) {
        params.filters.author = author
      }
      // You can await here
      const response = await pagefindRef.current.search(q, params)
      console.info('[Search] Pagefind search response', response)
      // ...
      setPagefindResult({ status: StatusSuccess, matches: response.results })
    }
    fetchData()
  }, [orderBy, author, q, lang, isSearchReady, pagefindRef, isSearchEnabled])

  if (!isSearchReady) {
    return null
  }
  return (
    <div className="Search page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <h1>{t('pagesBiographiesTitle')}</h1>

            <SearchSummary
              q={q}
              author={author}
              setQuery={setQuery}
              status={isSearchEnabled ? pagefindResult.status : queryStatus}
              count={count}
            />

            <OrderByDropdown
              values={orderByOptions}
              selectedValue={orderBy}
              onChange={(item) => {
                hasManuallySetOrderByRef.current = true
                setQuery({ orderBy: item.value })
              }}
            />
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            <SearchField
              status={isSearchEnabled ? pagefindResult.status : queryStatus}
              defaultValue={q}
              onSubmit={(e, value) => setQuery({ q: value })}
            />
          </Col>
        </Row>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            {isSearchEnabled ? (
              <ol>
                {pagefindResult.matches.map((result, i) => (
                  <li key={result.id} className="mt-5">
                    <PagefindMatch id={result.id} getData={result.data}>
                      {(result) => (
                        <>
                          <h4 className="m-0">
                            <a href={result.url.replace('.html', '')}>{result.meta.title}</a>
                          </h4>
                          <StoryAuthors
                            className="StoryItem_authors"
                            to={`/search?author=:author&q=${q}`}
                            authors={result.filters.author.map(
                              (slug) =>
                                authorIndex[slug] || {
                                  id: slug,
                                  slug: slug,
                                  fullname: slug,
                                },
                            )}
                          />
                          <blockquote
                            dangerouslySetInnerHTML={{ __html: result.excerpt }}
                          ></blockquote>
                        </>
                      )}
                    </PagefindMatch>
                  </li>
                ))}
              </ol>
            ) : (
              <ol>
                {data?.pages.map((page, i) =>
                  page.results.map((story) => (
                    <li key={i + '-' + story.slug} className="mt-5">
                      {/* <label className="small text-muted">
                        {i + 1} / {count}
                      </label> */}
                      <StoryItem story={story} />
                    </li>
                  )),
                )}
                <GenericIntersectionObserver onIntersect={onIntersectHandler} />
              </ol>
            )}
          </Col>
          <Col {...BootstrapEndColumnLayout}>
            {author.length > 0 && <Author className="mt-3" author={{ slug: author }} />}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Search
