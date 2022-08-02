import React from 'react'
import LangLink from './LangLink'

const AuthorItem = ({ author }) => (
  <LangLink to={`author/${author.slug}`} className="AuthorItem">
    {author.fullname}
  </LangLink>
)

export default AuthorItem
