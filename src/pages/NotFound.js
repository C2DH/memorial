import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import {
  BootstrapStartColumnLayout
} from '../constants'

const NotFound = () => {
  const { t } = useTranslation()
  return (
    <Container>
      <Row>
        <Col {...BootstrapStartColumnLayout}>
          <h1 className="my-5">{t('pagesNotFoundTitle')}</h1>
          <p>{t('pagesNotFoundSubheading')}</p>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound
