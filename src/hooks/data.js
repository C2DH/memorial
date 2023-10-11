import { useState } from 'react'
import axios from 'axios'
import { useTimeout } from './timeout'
import { useQuery } from '@tanstack/react-query'

export const orderedKeys = (key, value) => {
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
  timeout = import.meta.env.VITE_API_TIMEOUT || 0,
  onDownloadProgress,
  params,
  enabled = true,
}) => {
  const [isTimeoutComplete, setIsTimeoutComplete] = useState(delay === 0)
  const memoparams = params ? JSON.stringify(params).split('').sort().join('') : ''

  const response = useQuery({
    queryKey: [url, memoparams, memoid],
    queryFn: () => axios.get(url, { timeout, onDownloadProgress, params }).then(({ data }) => data),
    enabled: enabled && isTimeoutComplete,
  })

  useTimeout(() => {
    if (!isTimeoutComplete) {
      setIsTimeoutComplete(true)
    }
  }, delay)

  if (import.meta.env.NODE_ENV === 'development') {
    console.debug(
      '[useGetJSON] url:',
      url,
      params,
      '\n - enabled:',
      enabled,
      '\n - status:',
      response.status,
    )
  }
  return response
}

export const useGetRawContents = (opts) => {
  return useGetJSON({ ...opts, raw: true })
}
