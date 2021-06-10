import React from 'react'
import { Link } from 'react-router-dom'
import { useToWithLang } from '../logic/language'

export default function LangLink({ to, forceLanguage = null, ...props }) {
  const toWithLang = useToWithLang(to, forceLanguage)
  return <Link to={toWithLang} {...props} />
}
