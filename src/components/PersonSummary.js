import { useTranslation } from 'react-i18next'

const LabelBirthPlace = 'birthPlace'

const PersonSummary = ({ person, className = '' }) => {
  const { t } = useTranslation()
  const indexOfPlaces = person.data?.places?.reduce((acc, place) => {
    acc[place.label] = place
    return acc
  }, {})

  const firstName = person.data.first_name
  const lastName = person.data.last_name
  const profession = person.data
  const birth = null
  const death = null
  return (
    <div className={`PersonSummary ${className}`}>
      <h2>{t('summaryPerson', { firstName, lastName, birth, death })}</h2>
      {/* <pre>{JSON.stringify(indexOfPlaces, null, 2)}</pre> */}
    </div>
  )
}

export default PersonSummary
