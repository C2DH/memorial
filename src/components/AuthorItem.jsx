import React from 'react'
import LangLink from './LangLink'

const AuthorItem = ({ author, className, to = '/biographies?author=:author' }) => (
  <LangLink to={to.replace(':author', author.slug)} className={`AuthorItem ${className}`}>
    {author.fullname}
  </LangLink>
)

export default AuthorItem
