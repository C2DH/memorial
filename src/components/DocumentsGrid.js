import React, { useMemo } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import groupBy from 'lodash/groupBy'
import { useTranslation } from 'react-i18next'
import { getTranslatableTypeFromMetadata } from '../logic/metadata'

const DocumentsGrid = ({
  documents = [],
  ascending = true,
  groupKey = 'data.year',
  As,
  layout={md:{span:3}}
}) => {
  const { t } = useTranslation()
  const { documentsGroups, keys } = useMemo(() => {
    const documentsGroups = groupBy(documents, groupKey)
    let keys = Object.keys(documentsGroups).sort()
    if (!ascending) {
      keys.reverse()
    }
    console.info('updated keys', keys)
    return { documentsGroups, keys}
  }, [documents, ascending, groupKey])

  return keys.map((k) => (
    <Container className="my-5" key={k}>
      {k !== "undefined" && (
        <Row className="mb-2 pb-2 border-bottom border-dark">
          <Col>{
            groupKey === 'data.type'
              ? t(getTranslatableTypeFromMetadata({ type: k }))
              : k
          }</Col>
        </Row>
      )}
      <Row>
        {documentsGroups[k].map((d, i) => (
          <Col key={i} {...layout}>
            <As doc={d}/>
          </Col>
        ))}
      </Row>
    </Container>
  ))
}

export default DocumentsGrid
