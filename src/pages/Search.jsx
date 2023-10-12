import { useQueryParams, withDefault } from 'use-query-params'
import { QParam, SlugParam, createEnumParam } from '../logic/params'
import {
  BiographiesAvailableOrderBy,
  BiographiesAvailableOrderByValues,
  BootstrapEndColumnLayout,
  BootstrapStartColumnLayout,
  LanguageCodes,
  OrderByLatestCreatedFirst,
} from '../constants'
import { useEffect, useRef, useState } from 'react'
import PagefindMatch from '../components/PagefindMatch'
import { Col, Container, Row } from 'react-bootstrap'
import SearchField from '../components/SearchField'
import { StatusFetching, StatusIdle, StatusSuccess } from '../hooks/data'
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
  const pagefindRef = useRef(null)
  const [isSearchReady, setIsSearchReady] = useState(false)
  const [pagefindResult, setPagefindResult] = useState({ status: StatusIdle, matches: [] })
  const [{ q, lang, orderBy, author }, setQuery] = useQueryParams({
    q: withDefault(QParam, ''),
    lang: withDefault(createEnumParam(LanguageCodes), activeLanguageCode),
    orderBy: withDefault(
      createEnumParam(BiographiesAvailableOrderByValues),
      OrderByLatestCreatedFirst,
    ),
    author: withDefault(SlugParam, ''),
  })
  const isSearchEnabled = q.length > 1 && isSearchReady
  const queryParams = {}
  if (author.length) {
    queryParams.filters = {
      authors__slug: author,
    }
  }
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
    queryKey: ['biographies', author, activeLanguageCode, orderBy],
    queryFn: ({ pageParam = 1 }) =>
      axios
        .get('/api/story', {
          timeout: 30000, // 30 seconds
          // onDownloadProgress,
          params: {
            limit,
            orderby: orderBy,
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
      const params = {
        filters: {},
        sort: BiographiesAvailableOrderBy.find(({ value }) => value === orderBy).sort,
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
  }, [orderBy, author, q, lang, isSearchEnabled])

  // dinamically import pagefind script (only once)
  useEffect(() => {
    if (pagefindRef.current) {
      console.info('[Search] Pagefind already loaded')
      return
    }
    console.info('[Search] Pagefind loading')
    pagefindRef.current = true
    const script = document.createElement('script')
    script.src = '/pagefind/pagefind.js'
    script.async = true
    // use as import module
    script.type = 'module'
    // get the exprtrs

    script.onload = async () => {
      console.info('[Search] Pagefind loaded successfully')
      const pagefind = await import(
        /* @vite-ignore */ `${window.location.origin}/pagefind/pagefind.js`
      )
      pagefindRef.current = pagefind
      setIsSearchReady(true)
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

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
              values={BiographiesAvailableOrderBy}
              selectedValue={orderBy}
              onChange={(item) => {
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
