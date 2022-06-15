import {useEffect, useState} from 'react'

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

const getHeight = () => window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

const getWindowDimensions = () => ({
  width: getWidth(),
  height: getHeight()
})

/*
  Based on
  https://dev.to/vitaliemaldur/resize-event-listener-using-react-hooks-1k0c
  consulted on 2021-02-26
*/
export const useCurrentWindowDimensions = () => {
  let [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  useEffect(() => {
    let timeoutId = null;
    const resizeListener = () => {
      clearTimeout(timeoutId);
      const dims = getWindowDimensions()
      timeoutId = setTimeout(() => setWindowDimensions(dims), 150);
      // console.info('setWindowDimensions', dims)
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, [])
  return windowDimensions;
}
