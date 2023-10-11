import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { X } from 'react-feather'

const SearchSummary = ({ q = '', author = '', count = 0, setQuery }) => {
  const { t, i18n } = useTranslation()
  const languageCode = i18n.language.split('-').join('_')
  const authorsIndex = useStore((state) => state.authorsIndex)
  const authorMetadata = authorsIndex[author]
  let authorName = authorMetadata?.fullname || author
  try {
    authorName = authorMetadata?.data?.fullname[languageCode] || authorMetadata?.fullname || author
  } catch (e) {
    console.warn('[SearchSummary] authorName error:', e)
  }
  return (
    <div className="Biographies_summary">
      {q.length === 0 && (
        <>
          {author.length ? (
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t('biographiesCountWithAuthor', {
                    n: count,
                    q,
                    author: authorName,
                  }),
                }}
              />
              <button
                onClick={() => setQuery({ author: undefined })}
                className="btn btn-transparent d-inline p-0 btn-sm"
              >
                <X />
              </button>
            </p>
          ) : (
            <p
              dangerouslySetInnerHTML={{
                __html: t('biographiesCount', { n: count, q }),
              }}
            />
          )}
        </>
      )}
      {q.length > 0 && (
        <>
          {author.length ? (
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t('biographiesCountWithQueryAndAuthor', {
                    n: count,
                    q,
                    author: authorName,
                  }),
                }}
              />
              <button
                onClick={() => setQuery({ author: undefined })}
                className="btn btn-transparent d-inline p-0 btn-sm"
              >
                <X />
              </button>
            </p>
          ) : (
            <p
              dangerouslySetInnerHTML={{
                __html: t('biographiesCountWithQuery', { n: count, q }),
              }}
            />
          )}
        </>
      )}
    </div>
  )
}

export default SearchSummary
