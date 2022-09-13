const RegexQParam = new RegExp(/^[0-9a-zA-Z- ]+$/)
const RegexSlugParam = new RegExp(/^[0-9a-zA-Z-]+$/)

export const QParam = {
  decode(value) {
    if (RegexQParam.test(value)) {
      return value
    }
    return null
  },
}

export const SlugParam = {
  decode(value) {
    if (RegexSlugParam.test(value)) {
      return value
    }
    return null
  },
  encode(value) {
    if (typeof value === 'string') {
      return value
    }
    return undefined
  },
}
