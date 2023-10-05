import { useEffect, useState } from 'react'
// import StoryItem from './StoryItem'
import { useSprings, animated, to } from 'react-spring'
import { Col, Container, Row } from 'react-bootstrap'
import StoryAuthors from './StoryAuthors'

const toConfig = (i, delay = 0) => ({
  x: 0,
  // y: 50,
  y: -i * 200,
  opacity: 0,
  delay: delay,
})
const fromConfig = (i) => ({ x: 0, y: i * 200, opacity: 0 })

const GalleryOfStories = ({
  stories = [],
  language = 'en_GB',
  initialDelay = 500,
  className = '',
}) => {
  const [selectedStoryIdx, setSelectedStoryIdx] = useState(-1)
  const numberOfStories = stories.length || 0
  const [props, api] = useSprings(numberOfStories, (i) => ({
    to: toConfig(i, i === 0 ? initialDelay : 0),
    from: fromConfig(i),
  }))

  useEffect(() => {
    api.start((i) => {
      if (selectedStoryIdx === 0) {
        if (i === selectedStoryIdx) {
          return { x: 0, y: 0, opacity: 1, delay: i === 0 ? initialDelay : 0 }
        } else if (i === numberOfStories - 1) {
          return fromConfig(i - 1)
        }
      } else if (i < selectedStoryIdx) {
        return fromConfig(selectedStoryIdx - i)
      } else if (i === selectedStoryIdx) {
        return { x: 0, y: 0, opacity: 1, delay: i === 0 ? initialDelay : 0 }
      } else {
        return toConfig(selectedStoryIdx + i)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStoryIdx, initialDelay])

  useEffect(() => {
    // add interval
    const interval = setInterval(() => {
      setSelectedStoryIdx((i) => (i + 1) % numberOfStories)
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [numberOfStories])

  return (
    <Container
      fluid
      className={`GalleryOfStories ${className}`}
      // style={{ height: 500, marginTop: -250, overflow: 'hidden' }}
    >
      <Row className="h-100">
        <Col md={{ span: 5 }} className="h-100 position-relative" style={{ overflow: 'hidden' }}>
          {props.map(({ opacity }, i) => {
            const covers = stories[i].covers.filter((d) => d.data.type === 'image')
            const hasCovers = covers.length > 0
            if (!hasCovers) return null
            const cover = stories[i].covers[0].data
            const coverSrc = cover.resolutions?.preview?.url
            return (
              <animated.div
                key={i}
                className="position-absolute w-100 h-100 top-0 d-flex align-items-center"
                style={{
                  opacity,
                }}
              >
                <img src={coverSrc} style={{ width: '80%' }}></img>
              </animated.div>
            )
          })}
        </Col>
        <Col md={{ span: 7 }} className="h-100 position-relative" style={{ overflow: 'hidden' }}>
          {props.map(({ x, y, opacity }, i) => {
            const title = stories[i].data.title[language]

            return (
              <animated.div
                key={i}
                className="position-absolute w-100 d-flex align-items-center "
                style={{
                  opacity,
                  height: '50%',
                  top: '25%',

                  zIndex: 1,
                  // transform: to([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
                }}
              >
                <div>
                  <h2
                    className="me-3"
                    dangerouslySetInnerHTML={{
                      __html: title
                        .split(/[[\]]/)
                        .join('')
                        .split(/\{[^}]+\}/)
                        .join(''),
                    }}
                  ></h2>
                  <StoryAuthors authors={stories[i].authors} />
                </div>
              </animated.div>
            )
          })}
        </Col>
      </Row>
    </Container>
  )
}

export default GalleryOfStories
