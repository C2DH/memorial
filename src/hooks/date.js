export const useDate = ({ language }) => ({
  parseDate: (dateStr, long = false, opts = null, ifInvalid = null) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const dateItems = dateStr.split('-')
    if (isNaN(date.valueOf())) {
      return ifInvalid ? ifInvalid : dateStr
    }
    return date.toLocaleString(
      language,
      opts || {
        day: dateItems.length > 1 ? 'numeric' : undefined,
        month: dateItems.length > 0 ? (long ? 'long' : 'short') : undefined,
        year: 'numeric',
      },
    )
  },
})
