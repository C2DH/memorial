import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import { useBoundingClientRect } from '../hooks/viewport'
import { useGetJSON, StatusSuccess } from '../hooks/data'
import { BootstrapStartReducedColumnLayout, BootstrapEndExtendedColumnLayout } from '../constants'
import DocumentMetadata from '../components/DocumentMetadata'

const Person = () => {
  const [bbox, ref] = useBoundingClientRect()
  const { personId } = useParams()
  const safePersonId = personId.replace(/[^\dA-Za-z-_]/g, '')

  const viewerHeight = bbox.windowDimensions.height - 200
  const {
    data: doc,
    status,
    error,
  } = useGetJSON({
    url: `/api/document/${safePersonId}`,
  })
  if (error) {
    console.error('[Person]', '\n - docId:', safePersonId, '\n - api error:', error)
  }
  return (
    <div className="Person page">
      <Container>
        <Row>
          <Col {...BootstrapStartReducedColumnLayout}>
            <div
              className="d-flex flex-column justify-content-between"
              style={{ minHeight: viewerHeight }}
            >
              {status === StatusSuccess && (
                <>
                  <pre>{JSON.stringify(doc, null, true)}</pre>
                  <DocumentMetadata memoid={bbox.memo + ',' + doc.id} doc={doc} />
                </>
              )}
            </div>
          </Col>
          <Col {...BootstrapEndExtendedColumnLayout}></Col>
        </Row>
      </Container>
    </div>
  )
}

export default Person
