import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import NotFound from './NotFound'
import { BootstrapColumLayout } from '../constants'
// import hljs from 'highlight.js' // import hljs library


const ErrorPage = ({ error={}, errorCode=500, children }) => {
  const { t } = useTranslation()
  if (errorCode === 404) {
    return <NotFound />
  }
  const cleanedError = JSON.stringify(error, null, 2)
  return (
    <Container className="ErrorPage page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">{t('pages.errorViewer.title')}</h1>
          <h3>{t('pages.errorViewer.subheading')}</h3>
          <p className="mb-5" dangerouslySetInnerHTML={{
            __html: t('pages.errorViewer.message')
          }}/>
        </Col>
      </Row>
      <Row>
        <Col {...BootstrapColumLayout}>
          {children}
        </Col>
      </Row>
      <Row>
        <Col {...BootstrapColumLayout}>

          <div className="alert alert-warning" role="alert">
            page: <b>{window.location.pathname}</b>
            <br />{error.message}
          </div>
          <pre className='hljs d-block'>
          {cleanedError}
          </pre>
        </Col>
      </Row>
    </Container>
  )
}

export default ErrorPage
