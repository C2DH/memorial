import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollToElementById = (id) => {
  console.info('scrollToElementById', id)
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView();
  }
}

const ScrollTo = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    let timer;
    if (hash === '') {
      window.scrollTo(0, 0)
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const id = hash.replace('#', '')
        scrollToElementById(id)
      }, 0);
    }
    return () => {
      clearTimeout(timer)
    }
  }, [pathname, hash])

  return null;
}

export default ScrollTo
