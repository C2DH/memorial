import React from 'react'
import LangLink from './LangLink'

const AuthorItem = ({ author, className }) => (
  <LangLink to={`/biographies?author=${author.slug}`} className={`AuthorItem ${className}`}>
    {author.fullname}
  </LangLink>
)

export default AuthorItem
