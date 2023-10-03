import { Fragment } from 'react'

const HelmetItem = ({ asName = false, property = '', value = '', key = '' }) => {
  if (!value.length) {
    return null
  }
  // e.g; we can have multiple values for "article:tag"
  if (Array.isArray(value)) {
    return (
      <Fragment>
        {value.map((v, j) => (
          <HelmetItem key={[property, j].join('-')} property={property} value={v} asName={asName} />
        ))}
      </Fragment>
    )
  }

  if (asName) {
    return <meta key={key} name={property} content={value} />
  }
  return <meta key={key} property={property} content={value} />
}

export default HelmetItem
