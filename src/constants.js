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

export const LinesMapRoute = { to: '/map', label: 'navigationLinesMapRoute' }

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
export const SlidesRoute = {
  to: '/slides/:pageId',
  label: 'navigationSlides',
}
export const AboutRoute = { to: '/pages/about', label: 'navigationAbout' }
export const FaqRoute = { to: '/pages/faq', label: 'navigationFaq' }
export const TermsOfUseRoute = { to: '/pages/terms-of-use', label: 'navigationTermsOfUse' }
export const TimelineRoute = { to: '/pages/timeline', label: 'navigationTimeline' }
export const PrimaryRoutes = [HomeRoute, PeopleRoute, SearchRoute, AboutRoute]

export const AllRoutes = [
  HomeRoute,
  PeopleRoute,
  SearchRoute,
  AboutRoute,
  StoryRoute,
  FaqRoute,
  SearchStoryRoute,
  TermsOfUseRoute,
  DocumentRoute,
  BiographiesRoute,
  LinesMapRoute,
  SlidesRoute,
]

export const Languages = (import.meta.env.VITE_LANGUAGES ?? 'en-GB,fr-FR,de-DE').split(',')
export const MillerLanguages = Languages.map((l) => l.split('-').join('_'))
export const LanguageCodes = Languages.map((l) => l.split('-')[0])
export const LanguageRoutePattern = `/:lang(${LanguageCodes.join('|')})`
export const LanguagePathRegExp = new RegExp(`/(${LanguageCodes.join('|')})/`)
export const LanguageRootPathRegExp = new RegExp(`^/(${LanguageCodes.join('|')})/?$`)
export const DefaultLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE ?? 'en-GB'
export const DefaultLanguageCode = DefaultLanguage.split('-')[0]

export const MillerAPI = import.meta.env.VITE_MILLER_API ?? '/api'

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
  md: { span: 5, offset: 1 },
})
export const BootstrapEndExtendedColumnLayout = Object.freeze({
  md: { span: 6, offset: 0 },
})

// export const PebbleColors = ['#7dc0ff', '#ae96ff', '#e592e9', '#d6dd71', '#dcbf87', '#dcdec3']
export const PebbleColors = [
  'hsl(350, 92%, 66%)',
  'hsl(249, 100%, 84%)',
  'hsl(191, 74%, 76%)',
  'hsl(68, 67%, 65%)',
  'hsl(29, 100%, 66%)',
]
export const OrderByLatestModifiedFirst = '-date_last_modified'
export const OrderByOldestModifiedFirst = 'date_last_modified'
export const OrderByLatestCreatedFirst = '-date_created'
export const OrderByOldestCreatedFirst = 'date_created'

export const BiographiesAvailableOrderBy = [
  {
    value: OrderByLatestModifiedFirst,
    label: 'orderByLatestModifiedFirst',
    sort: { date_last_modified: 'desc' },
  },
  {
    value: OrderByOldestModifiedFirst,
    label: 'orderByOldestModifiedFirst',
    sort: { date_last_modified: 'asc' },
  },
  {
    value: OrderByLatestCreatedFirst,
    label: 'orderByLatestCreatedFirst',
    sort: { date_created: 'desc' },
  },
  {
    value: OrderByOldestCreatedFirst,
    label: 'orderByOldestCreatedFirst',
    sort: { date_created: 'asc' },
  },
]

export const BiographiesAvailableOrderByValues = BiographiesAvailableOrderBy.map((d) => d.value)

export const BiographyIdQueryParamName = 'story'
