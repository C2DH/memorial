const RegexQParam = new RegExp(/^[0-9a-zA-Z- ]+$/)

export const QParam = {
  decode(value) {
    if (RegexQParam.test(value)) {
      return value
    }
    return null
  },
}
