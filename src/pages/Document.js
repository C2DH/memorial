import React from 'react'
import { Container } from 'react-bootstrap'
import { useParams } from 'react-router'

const Resource = () => {
  const { docId } = useParams()
  const safeDocumentId = docId.replace(/[^\dA-Za-z-_]/g, '')
  return (
    <div className="Document page">
      <Container fluid>{safeDocumentId}</Container>
    </div>
  )
}

export default Resource
