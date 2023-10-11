import { useTranslation } from 'react-i18next'

const PersonSummary = ({ person, className = '' }) => {
  const { t } = useTranslation()
  const indexOfPlaces =
    person.data?.places?.reduce((acc, place) => {
      acc[place.label] = place
      return acc
    }, {}) || {}

  const firstName = person.data.first_name
  const lastName = person.data.last_name
  // const profession = person.data
  const birthDate = new Date(person.data.birth_date)
  const deathDate = new Date(person.data.death_date)
  let birth = null
  let death = null

  if (!isNaN(birthDate)) {
    if (indexOfPlaces.birth_place) {
      birth = t('summaryBirth', {
        birthDate: birthDate,
        birthPlace: indexOfPlaces.birth_place.toponymName,
      })
    } else {
      birth = t('summaryBirthNoPlace', { birthDate: birthDate })
    }
  }

  if (!isNaN(deathDate)) {
    if (indexOfPlaces.birth_place) {
      death = t('summaryDeath', {
        deathDate: deathDate,
        deathPlace: indexOfPlaces.death_place.toponymName,
      })
    } else {
      death = t('summaryDeathNoPlace', { deathDate: deathDate })
    }
  }

  return (
    <div className={`PersonSummary ${className}`}>
      <h2
        dangerouslySetInnerHTML={{
          __html: t('summaryPerson', { firstName, lastName, birth, death }),
        }}
      />
      {/* <pre>{JSON.stringify(indexOfPlaces, null, 2)}</pre> */}
    </div>
  )
}

export default PersonSummary
