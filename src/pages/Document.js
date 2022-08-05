import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import { useBoundingClientRect } from '../hooks/viewport'
import { useGetJSON, StatusSuccess } from '../hooks/data'
import { BootstrapStartReducedColumnLayout, BootstrapEndExtendedColumnLayout } from '../constants'
import DocumentViewer from '../components/DocumentViewer'
import DocumentMetadata from '../components/DocumentMetadata'
import TopStories from '../components/TopStories'

const Document = () => {
  const [bbox, ref] = useBoundingClientRect()
  const { docId } = useParams()
  const safeDocumentId = docId.replace(/[^\dA-Za-z-_]/g, '')
  // load document from API
  const {
    data: doc,
    status,
    error,
  } = useGetJSON({
    url: `/api/document/${safeDocumentId}`,
  })
  if (error) {
    console.error('[Document]', '\n - docId:', safeDocumentId, '\n - api error:', error)
  }
  const viewerHeight = bbox.windowDimensions.height - 200
  return (
    <div className="Document page">
      <Container>
        <Row>
          <Col {...BootstrapStartReducedColumnLayout}>
            <div
              className="d-flex flex-column justify-content-between"
              style={{ minHeight: viewerHeight }}
            >
              {status === StatusSuccess && (
                <>
                  <DocumentMetadata memoid={bbox.memo + ',' + doc.id} doc={doc} />
                  <TopStories
                    params={{
                      filters: { slug__startswith: doc.slug.split('-', -1).slice(0, -1).join('-') },
                    }}
                  />
                </>
              )}
              <div>
                <p className="mt-3">
                  Interested in this archival item? <a href="mailto:info@c2dh.uni.lu">Contact us</a>{' '}
                  to find out how to get access to it
                </p>
                <p>Have additional information or documents to contribute?</p>
                <button className="btn btn-primary">Send us Pages of Testimony</button>
              </div>
            </div>
          </Col>
          <Col
            {...BootstrapEndExtendedColumnLayout}
            className="position-relative"
            ref={ref}
            style={{ height: viewerHeight }}
          >
            <div className="position-absolute bg-dark h-100 w-100 shadow">
              {status === StatusSuccess && (
                <DocumentViewer
                  memoid={bbox.memo + '' + doc.id}
                  doc={doc}
                  height={viewerHeight}
                  width={bbox.width}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Document
