# Memorial de la Deportation
React app connected to Miller

    make run-dev

## API queries (temporary)
Get the components of a family:
`/api/document/?filters={"data__households__contains":["0020"]}`

Get different paths of the people deported to a camp:
`/api/document/?filters={"data__deported_to__contains":["Litzmannstadt"]}&facets=data__deported_to`

Get the stories where the document is mentioned
`api/story/?filters={"documents__pk__in":[5,3]}`
