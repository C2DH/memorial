import { useState } from 'react'
import axios from 'axios'
import { useTimeout } from './timeout'
import { useQuery } from 'react-query'

const orderedKeys = (key, value) => {
  if (value instanceof Object && !(value instanceof Array)) {
    return Object.keys(value)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = value[key]
        return sorted
      }, {})
  }
  return value
}

export const StatusIdle = 'idle'
export const StatusFetching = 'loading'
export const StatusSuccess = 'success'
export const StatusError = 'error'
export const StatusNone = 'none'

export const useGetJSON = ({
  url,
  memoid = '',
  delay = 0,
  timeout = process.env.REACT_APP_API_TIMEOUT || 0,
  onDownloadProgress,
  params,
}) => {
  const [enabled, setEnabled] = useState(false)
  const memoparams = params ? JSON.stringify(params).split('').sort().join('') : ''

  const response = useQuery({
    queryKey: [url, memoparams, memoid],
    queryFn: () => axios.get(url, { timeout, onDownloadProgress, params }).then(({ data }) => data),
    enabled,
  })
  useTimeout(() => {
    if (!enabled) {
      setEnabled(true)
    }
  }, delay)
  if (enabled && process.env.NODE_ENV === 'development') {
    console.debug('[useGetJSON] url:', url, 'status', response.status, memoparams)
  }
  return response
}

export const useGetRawContents = (opts) => {
  return useGetJSON({ ...opts, raw: true })
}
