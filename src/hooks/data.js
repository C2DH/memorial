import { useRef, useState, useEffect } from 'react'
import axios from 'axios'

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

export const StatusIdle = 'IDLE'
export const StatusNone = 'NONE'
export const StatusFetching = 'FETCHING'
export const StatusError = 'ERROR'
export const StatusSuccess = 'SUCCESS'

export const useGetJSON = ({
  url,
  params = {},
  allowCached = true,
  delay = 0,
  onDownloadProgress,
  timeout = process.env.REACT_APP_API_TIMEOUT || 0,
  raw = false,
}) => {
  const cache = useRef({})
  const cacheKey = JSON.stringify(
    {
      url,
      params,
    },
    orderedKeys,
  )
  console.info('useGetJSON', cacheKey)
  const [response, setResponse] = useState({
    data: null,
    error: null,
    status: StatusIdle,
  })
  if (process.env.NODE_ENV === 'development') {
    console.debug('useGetDataset url:', url, 'response', response)
  }
  useEffect(() => {
    let cancelRequest = false
    let timer = null
    if (!url) {
      setResponse({
        data: null,
        error: null,
        status: StatusNone,
      })
      return
    }
    const fetchData = async () => {
      setResponse({
        data: null,
        error: null,
        status: StatusFetching,
      })
      if (cache.current[url] && allowCached === true) {
        console.debug('useGetDataset allowCached url:', url)
        const data = cache.current[url]
        if (!raw) {
          data.cached = true
        }
        if (cancelRequest) return
        setResponse({
          data: data,
          error: null,
          status: StatusSuccess,
        })
      } else {
        console.debug('useGetDataset load fresh url:', url, 'timeout', timeout)
        return axios
          .get(url, { params, timeout, onDownloadProgress })
          .then(({ data }) => {
            cache.current[url] = data // set response in cache;
            if (cancelRequest) return
            setResponse({
              data: data,
              error: null,
              status: StatusSuccess,
            })
          })
          .catch((err) => {
            if (cancelRequest) return

            setResponse({
              data: null,
              error: err,
              errorCode: err.response?.status || err.code,
              status: StatusError,
            })
          })
      }
    }
    if (delay) {
      console.debug('useGetDataset delayed: ', delay)
      timer = setTimeout(() => {
        console.debug('useGetDataset executed after: ', delay)
        fetchData()
      }, delay)
    } else {
      fetchData()
    }

    // "If useEffect returns a function, React will run it when it is time to clean up:"
    return function cleanup() {
      cancelRequest = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, allowCached, delay])
  return response
}

export const useGetRawContents = (opts) => {
  return useGetJSON({ ...opts, raw: true })
}
