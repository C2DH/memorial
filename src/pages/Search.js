import React, {useEffect} from 'react'
import { Container, Row, Col, ButtonGroup, Dropdown, FormControl } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDocuments } from '@c2dh/react-miller'
import { useCurrentWindowDimensions } from '../hooks'
import { useStore } from '../store'
import DocumentViewerPerson from '../components/DocumentViewer/DocumentViewerPerson'
import {
  useQueryParams,
  StringParam,
  ArrayParam,
  withDefault,
} from 'use-query-params'

const DocumentsPager = ({ loading, pagination }) => {
  const { t } = useTranslation()
  if (loading) {
    return t('pagesSearchLoading')
  }
  if(pagination) {
    return (
      <div dangerouslySetInnerHTML={{
        __html: t('pagesSearchWithCount', { count: pagination.count})
      }}/>
    )
  }
  return t('pagesSearchError')
}

const Search = () => {
  const { height } = useCurrentWindowDimensions()
  const { t, i18n } = useTranslation()
  const {changeTheme} = useStore(state => state)

  useEffect(() => {
    changeTheme({
      name: 'themeSearch',
    })
  }, [changeTheme])
  const [query, setQuery] = useQueryParams({
    q: withDefault(StringParam, ''),
    g: withDefault(StringParam, 'data.type'),
    sort: withDefault(StringParam , 'asc'),
    filters: withDefault(ArrayParam, []),
  });
  console.info('current query', query)

  const [documents, pagination, { loading, error }] = useDocuments({
    limit: 1000,
    offset: 0,
    q: query.q,
    // filters: {
    //   data__type: queryString.type || undefined,
    // },
    exclude: { type: 'entity' },
    crossFacets: {
      allFacets: {
        facets: ['data__type'],
        exclude: { type: 'entity' },
      },
    },
  }, {
    language: i18n.language.split('-').join('_'),
    defaultLanguage: i18n.options.defaultLocale,
  })

  if (error) {
    console.error('render page: Search', error)
  }
  const handleChangeSearchQuery = (event) => {
    let q = event.target.value.trim()
    if(!q.length) {
      setQuery({ q: null })
    } else {
      if (q.indexOf('*') === -1) {
        q = q + '*'
      }
      console.info('QUERY', q)
      setQuery({ q: q })
    }
  }
  return (
    <div className="Search position-relative" style={{minHeight: height}}>
      <Container style={{paddingTop: '8rem'}}>
        <Row className="h-100 d-flex align-items-center">
          <Col>
            <h1>{t('pagesSearchTitle')}</h1>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className=" border-bottom border-white">
          <Col>
            <form className="form-inline mb-2">
            <FormControl className="mr-2 bg-transparent border border-white" type="input"
              defaultValue={query.q}
              placeholder={t('pagesSearchPlaceholder')}
              onChange={handleChangeSearchQuery}>
            </FormControl>
            <DocumentsPager loading={loading} pagination={pagination} />

            </form>
          </Col>
        </Row>
        <Row className="border-bottom border-white">
          <Col>
            <Dropdown className="my-2" as={ButtonGroup}>
              <Dropdown.Toggle variant="link" id="dropdown-basic-button" className="p-0 pb-1">
                {t(`pagesCollectionSortingGroup-${query.g.replace('.','')}`)}
              </Dropdown.Toggle>
              <Dropdown.Menu className="bg-white">
                {['data.year', 'data.type', 'type', 'data.creator', 'all'].filter(g => g !== query.g).map((g,i) => (
                  <Dropdown.Item key={i} active={query.g === g} onClick={() => setQuery({ g })}>
                    {t(`pagesCollectionSortingGroup-${g.replace('.','')}`)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown className="my-2" as={ButtonGroup}>
              <Dropdown.Toggle variant="link" id="dropdown-basic-button" className="p-0 pb-1">
                {t(`pagesCollectionSortingOrder-${query.sort}`)}
              </Dropdown.Toggle>
              <Dropdown.Menu className="bg-white">
                {['asc', 'desc'].filter(sort => sort !== query.sort).map((sort, i) => (
                  <Dropdown.Item key={i} active={query.sort === sort} onClick={() => setQuery({ sort })}>
                    {t(`pagesCollectionSortingOrder-${sort}`)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
        {documents ? documents.map((person, i) => (
          <Col key={i}>
            <DocumentViewerPerson person={person}/>
          </Col>
        )): null}
        </Row>
      </Container>
      {documents ? <pre>{JSON.stringify(documents, null, 2)}</pre>: null}
    </div>
  )
}

export default Search
