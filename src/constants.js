export const HomeRoute = { to:'/', label: 'navigationHome'}
export const SearchRoute = { to: '/search', label: 'navigationSearch' }
export const PeopleRoute = { to: '/people', label: 'navigationPeople' }

export const StoriesRoute = { to: '/stories', label: 'navigationStories' }
export const StoryRoute = { to: '/story/:storyId', label: 'navigationStory', parentRoute: StoriesRoute }
export const AboutRoute = { to: '/about', label: 'navigationAbout' }
export const TermsOfUseRoute = { to:'/terms', label: 'navigationTermsOfUse'}
export const PrimaryRoutes = [
  HomeRoute,
  PeopleRoute,
  SearchRoute,
  AboutRoute
]

export const AllRoutes = [
  HomeRoute,
  PeopleRoute,
  SearchRoute,
  AboutRoute,
  StoriesRoute,
  StoryRoute
]

export const Languages = (process.env.REACT_APP_LANGUAGES ?? 'en-GB,fr-FR,de-DE').split(',')
export const LanguageCodes = Languages.map((l) => l.split('-')[0])
export const LanguageRoutePattern = `/:lang(${LanguageCodes.join('|')})`
export const LanguagePathRegExp = new RegExp(`\/(${LanguageCodes.join('|')})\/`)
export const LanguageRootPathRegExp = new RegExp(`^\/(${LanguageCodes.join('|')})/?$`)
export const DefaultLanguage = process.env.REACT_APP_DEFAULT_LANGUAGE ?? 'en-GB'
export const DefaultLanguageCode = DefaultLanguage.split('-')[0]

export const MillerAPI = process.env.REACT_APP_MILLER_API ?? '/api';

export const BootstrapColumnLayout = Object.freeze({
  md: {span: 6, offset:3},
})
export const BootstrapStartColumnLayoutNoOffset = Object.freeze({
  md: {span: 7},
})
export const BootstrapStartColumnLayout = Object.freeze({
  md: {span: 7, offset:1},
})
export const BootstrapEndColumnLayout = Object.freeze({
  md: {span: 4},
})
