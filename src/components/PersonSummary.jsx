import { useTranslation } from 'react-i18next'

const PersonSummary = ({ person, indexOfPlaces = {}, className = '' }) => {
  const { t } = useTranslation()

  const firstName = person.data.first_name
  const lastName = person.data.last_name
  // const profession = person.data
  const birthDate = new Date(person.data.birth_date)
  const deathDate = new Date(person.data.death_date)
  let birth = null
  let death = null
  let gender = person.data.gender || ''
  if (!isNaN(birthDate)) {
    if (indexOfPlaces.birth_place) {
      birth = t('summaryBirth' + gender, {
        birthDate: birthDate,
        birthPlace: indexOfPlaces.birth_place.toponymName,
      })
    } else {
      birth = t('summaryBirthNoPlace' + gender, { birthDate: birthDate })
    }
  }

  if (!isNaN(deathDate)) {
    if (indexOfPlaces.death_place) {
      death = t('summaryDeath' + gender, {
        deathDate: deathDate,
        deathPlace: indexOfPlaces.death_place.toponymName,
      })
    } else {
      death = t('summaryDeathNoPlace' + gender, { deathDate: deathDate })
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
