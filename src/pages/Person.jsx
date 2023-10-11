import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import { useBoundingClientRect } from '../hooks/viewport'
import { useGetJSON, StatusSuccess } from '../hooks/data'
import { BootstrapStartColumnLayout, BootstrapEndColumnLayout } from '../constants'
// import DocumentMetadata from '../components/DocumentMetadata'
import PersonSummary from '../components/PersonSummary'
import TopStories from '../components/TopStories'
import TopDocuments from '../components/TopDocuments'
import { useTranslation } from 'react-i18next'
import DocumentImage from '../components/DocumentImage'
import MetadataField from '../components/MetadataField'

const LocationMetadataFields = ['address_before_19411016']

const Person = () => {
  const { t } = useTranslation()
  const [bbox, ref] = useBoundingClientRect()
  const { personId } = useParams()
  const safePersonId = personId.replace(/[^\dA-Za-z-_]/g, '')

  const viewerHeight = bbox.windowDimensions.height - 200
  const {
    data: person,
    status,
    error,
  } = useGetJSON({
    url: `/api/document/${safePersonId}?a=b`,
  })
  const relatedImage =
    person && Array.isArray(person.documents) && person.documents.length > 0
      ? person.documents[0]
      : null
  if (error) {
    console.error('[Person]', '\n - docId:', safePersonId, '\n - api error:', error, person)
  }
  console.debug('[Person]', '\n - docId:', safePersonId, '\n - data:', person)

  return (
    <div className="Person page">
      <Container>
        <Row>
          <Col {...BootstrapStartColumnLayout}>
            <h1>{person?.title}</h1>
            <div
              className="d-flex flex-column justify-content-between"
              style={{ minHeight: viewerHeight }}
            >
              {status === StatusSuccess && (
                <>
                  <PersonSummary person={person} className="mt-3" />
                  <section>
                    <MetadataField value={person.data['nationality']} label={'nationality'} />
                    <MetadataField value={person.data['enter_date']} label={'enter_date'} />
                  </section>
                  <section>
                    <h3>{t('birth')}</h3>
                    {[('birth_date', 'birth_date_org')].map((field) => (
                      <MetadataField key={field} value={person.data[field]} label={field} />
                    ))}
                  </section>
                  <pre>{JSON.stringify(person?.data, null, 2)}</pre>
                </>
              )}
            </div>
          </Col>
          <Col
            {...BootstrapEndColumnLayout}
            className="position-relative"
            ref={ref}
            style={{ minHeight: viewerHeight }}
          >
            {relatedImage !== null && <DocumentImage className="mt-5" doc={relatedImage} />}

            {status === StatusSuccess &&
              Array.isArray(person.data.households) &&
              person.data.households.map((d) => (
                <React.Fragment key={d}>
                  <label className="text-uppercase small fw-bold mt-5">
                    {t('actionReadBiography')}&nbsp;
                  </label>
                  <TopStories
                    className="my-5"
                    params={{
                      filters: {
                        slug: d,
                      },
                    }}
                    reduced
                  />
                  <TopDocuments
                    className="mt-5"
                    params={{
                      filters: {
                        data__households__contains: [d],
                      },
                      exclude: {
                        slug: person.slug,
                      },
                    }}
                    itemProps={{
                      // withLinks: true,
                      active: true,
                      className: 'mt-4',
                    }}
                    hideIfEmpty
                  >
                    <label className="text-uppercase small fw-bold mb-3">{t('people')}&nbsp;</label>
                  </TopDocuments>
                </React.Fragment>
              ))}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Person
