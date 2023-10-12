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
  const indexOfPlaces = person
    ? person.data?.places?.reduce((acc, place) => {
        acc[place.label] = place
        return acc
      }, {}) || {}
    : {}
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
                  <PersonSummary person={person} indexOfPlaces={indexOfPlaces} className="mt-3" />
                  <section className="mt-3">
                    {['first_name', 'last_name'].map((label) => (
                      <MetadataField
                        key={label}
                        value={person.data[label]}
                        hideIfEmpty
                        label={label}
                      />
                    ))}
                    <MetadataField
                      value={person.data['last_name_changed']}
                      hideIfEmpty
                      label={'last_name_changed'}
                    />
                  </section>
                  <section className="mt-3">
                    <MetadataField value={person.data['birth_date']} label={'birth_date'} />
                    {[
                      'birth_date_org',
                      'birth_place',
                      'birth_place_alt',
                      'birth_country',
                      'birth_country_alt',
                    ].map((field) => (
                      <MetadataField
                        key={field}
                        value={person.data[field]}
                        label={field}
                        hideIfEmpty
                      />
                    ))}
                  </section>
                  <section className="mt-3">
                    <MetadataField value={person.data['death_date']} label={'death_date'} />
                    {[
                      'death_date_org',
                      'death_place',
                      'death_place_alt',
                      'death_country',
                      'death_country_alt',
                    ].map((label) => (
                      <MetadataField
                        key={label}
                        value={person.data[label]}
                        label={label}
                        hideIfEmpty
                      />
                    ))}
                  </section>
                  <section className="mt-3">
                    <MetadataField value={person.data['nationality']} label={'nationality'} />
                    <MetadataField
                      value={person.data['nationality_notes']}
                      hideIfEmpty
                      label={'nationality_notes'}
                    />

                    <MetadataField value={person.data['enter_date']} label={'enter_date'} />
                    <MetadataField value={person.data['enter_place']} label={'enter_place'} />
                  </section>
                  <section className="mt-3">
                    {[
                      'exit_19400510_to_19411015_date',
                      'exit_19400510_to_19411015_place',
                      'exit_before_19411015_date',
                      'exit_before_19411015_place',
                      'exit_19411016_TO_19440910_date',
                      'exit_19411016_TO_19440910_place',
                    ].map((label) => (
                      <MetadataField
                        key={label}
                        hideIfEmpty
                        value={person.data[label]}
                        label={label}
                        className="mb-1"
                      />
                    ))}
                  </section>
                  <details className="mt-3">
                    <summary>{t('Technical details')}</summary>

                    <pre>{JSON.stringify(person?.data, null, 2)}</pre>
                  </details>
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
