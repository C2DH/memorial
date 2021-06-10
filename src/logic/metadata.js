import { DateTime } from 'luxon'
import isEmpty from 'lodash/isEmpty'

export const getDateFromMetadata = ({ date, start_date, end_date }) => {
  if (!isEmpty(date)) {
    return date
  }
  try{
    const startDate = DateTime.fromISO(start_date)
    const endDate = DateTime.fromISO(end_date)
    const diff = endDate.diff(startDate, ['days']).toObject()
    if (diff.days > 60) {
      return startDate.year !== endDate.year
        ? `${startDate.year} - ${startDate.year}`
        : startDate.year
    } else if(diff.days === 0) {
      return startDate.toLocaleString()
    } else {
      return `${startDate.toLocaleString()} - ${endDate.toLocaleString()}`
    }
    // return JSON.stringify(diff) +
    // JSON.stringify(startDate) + JSON.stringify(endDate)
  } catch(e) {
    console.error(e)
    return '(invalid date)'
  }
}

export const getTranslatableTypeFromMetadata = ({ type = '' }) => {
  return 'documentTypes' + type.split(' ').join('').toLowerCase()
}
