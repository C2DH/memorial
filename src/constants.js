export const HomeRoute = { to: '/', label: 'navigationHome' }
export const SearchRoute = { to: '/search/all', label: 'navigationSearch' }
export const BiographiesRoute = { to: '/biographies', label: 'navigationBiographies' }
export const SearchStoryRoute = {
  to: '/search/stories',
  label: 'navigationStorySearch',
  parentRoute: SearchRoute,
}
export const SearchDocRoute = {
  to: '/search/docs',
  label: 'navigationSearchDoc',
  parentRoute: SearchRoute,
}
export const PeopleRoute = { to: '/people', label: 'navigationPeople' }
export const NotFoundRoute = { to: '/404', label: 'navigationNotFound' }

export const StoryRoute = {
  to: '/story/:storyId',
  label: 'navigationStory',
  parentRoute: BiographiesRoute,
}
export const AuthorRoute = {
  to: '/author/:authorId',
  label: 'navigationAuthor',
  parentRoute: SearchStoryRoute,
}
export const DocumentRoute = {
  to: '/doc/:docId',
  label: 'navigationDoc',
  parentRoute: SearchDocRoute,
}
export const AboutRoute = { to: '/pages/about', label: 'navigationAbout' }
export const TermsOfUseRoute = { to: '/pages/terms-of-use', label: 'navigationTermsOfUse' }
export const PrimaryRoutes = [HomeRoute, PeopleRoute, SearchRoute, AboutRoute]

export const AllRoutes = [
  HomeRoute,
  PeopleRoute,
  SearchRoute,
  AboutRoute,
  StoryRoute,
  SearchStoryRoute,
  TermsOfUseRoute,
  DocumentRoute,
  BiographiesRoute,
]

export const Languages = (process.env.REACT_APP_LANGUAGES ?? 'en-GB,fr-FR,de-DE').split(',')
export const MillerLanguages = Languages.map((l) => l.split('-').join('_'))
export const LanguageCodes = Languages.map((l) => l.split('-')[0])
export const LanguageRoutePattern = `/:lang(${LanguageCodes.join('|')})`
export const LanguagePathRegExp = new RegExp(`/(${LanguageCodes.join('|')})/`)
export const LanguageRootPathRegExp = new RegExp(`^/(${LanguageCodes.join('|')})/?$`)
export const DefaultLanguage = process.env.REACT_APP_DEFAULT_LANGUAGE ?? 'en-GB'
export const DefaultLanguageCode = DefaultLanguage.split('-')[0]

export const MillerAPI = process.env.REACT_APP_MILLER_API ?? '/api'

export const BootstrapColumnLayout = Object.freeze({
  md: { span: 11, offset: 1 },
})
export const BootstrapStartColumnLayoutNoOffset = Object.freeze({
  md: { span: 7 },
})
export const BootstrapStartColumnLayout = Object.freeze({
  md: { span: 7, offset: 1 },
})
export const BootstrapEndColumnLayout = Object.freeze({
  md: { span: 4 },
})
export const BootstrapStartReducedColumnLayout = Object.freeze({
  md: { span: 5, offset: 0 },
})
export const BootstrapEndExtendedColumnLayout = Object.freeze({
  md: { span: 5, offset: 2 },
})
