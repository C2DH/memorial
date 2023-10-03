const RegexQParam = new RegExp(/^[0-9a-zA-Z- *äëïöüç]+$/)
const RegexSlugParam = new RegExp(/^[0-9a-zA-Z-]+$/)

export const QParam = {
  decode(value) {
    if (RegexQParam.test(value)) {
      return value
    }
    return null
  },
  encode(value) {
    if (RegexQParam.test(value)) {
      return value
    }
    return undefined
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

export const createEnumParam = (values) => ({
  decode(value) {
    if (values.includes(value)) {
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
})
