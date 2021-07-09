import React, {useEffect} from 'react'
import { Container, Row, Col, ButtonGroup, Dropdown, FormControl } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDocuments } from '@c2dh/react-miller'
import { useCurrentWindowDimensions } from '../hooks'
import { useStore } from '../store'
import DocumentsGrid from '../components/DocumentsGrid'
import DocumentViewer from '../components/DocumentViewer/DocumentViewer'
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

const People = ({ debug = false}) => {
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
    g: withDefault(StringParam, 'data.birth_year'),
    sort: withDefault(StringParam , 'asc'),
    filters: withDefault(ArrayParam, []),
  });
  console.info('current query', query)

  const [documents, pagination, { loading, error }] = useDocuments({
    limit: 1000,
    offset: 0,
    q: query.q,
    filters: {
      type__in: ['image'],
    },
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
      <Container className="bg-accent" style={{position: 'sticky', top: 65, zIndex: 1}}>
        <Row className=" border-bottom border-dark py-2" >
          <Col>
            <form className="form-inline">
            <FormControl className="mr-2 bg-transparent border border-dark" type="input"
              defaultValue={query.q}
              placeholder={t('pagesSearchPlaceholder')}
              onChange={handleChangeSearchQuery}>
            </FormControl>
            <DocumentsPager loading={loading} pagination={pagination} />
            <div class="form-group" className="mx-2"> Group by</div>
            <Dropdown className="my-2" as={ButtonGroup}>
              <Dropdown.Toggle variant="transparent" id="dropdown-basic-button" className="border-bottom border-dark">
                <b>{t(query.g.replace('.',''))}</b>
              </Dropdown.Toggle>
              <Dropdown.Menu className="bg-accent border border-dark">
                {['data.convoy', 'data.last_name', 'data.birth_year', 'data.birth_place', 'data.death_place', 'data.sex', 'all'].filter(g => g !== query.g).map((g,i) => (
                  <Dropdown.Item key={i} active={query.g === g} onClick={() => setQuery({ g })}>
                    {t(g.replace('.',''))}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="my-2 ml-1" as={ButtonGroup}>
              <Dropdown.Toggle variant="transparent" id="dropdown-basic-button" className="border-bottom border-dark">
                {t(query.sort)}
              </Dropdown.Toggle>
              <Dropdown.Menu className="bg-accent border border-dark">
                {['asc', 'desc'].filter(sort => sort !== query.sort).map((sort, i) => (
                  <Dropdown.Item key={i} active={query.sort === sort} onClick={() => setQuery({ sort })}>
                    {t(sort)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            </form>
          </Col>
        </Row>

      </Container>
      
      <Container className="mt-4">
        <Row>
        {documents ? documents.map((doc, i) => (
          <Col key={i} md={{span:3}}>
            <DocumentViewer doc={doc}/>
          </Col>
        )): null}
        </Row>
      </Container>
      {debug && documents ? <pre>{JSON.stringify(documents, null, 2)}</pre>: null}
    </div>
  )
}

export default People
