import { useEffect, useState } from 'react'
// import StoryItem from './StoryItem'
import { useSprings, animated } from 'react-spring'
import { Col, Container, Row } from 'react-bootstrap'
import StoryAuthors from './StoryAuthors'

import './GalleryOfStories.css'
import DocumentDate from './DocumentDate'
import { ArrowLeft } from 'react-feather'

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
  const storyCovers = stories.map((story) => {
    const cover = story.covers?.find((d) => d.data.type === 'image')
    return cover || null
  })

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
    setSelectedStoryIdx(0)
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
        <Col
          md={{ span: 4, offset: 0 }}
          className="h-100 position-relative"
          style={{ overflow: 'hidden' }}
        >
          {props.map(({ opacity }, i) => {
            if (!storyCovers[i]) return null
            const coverSrc = storyCovers[i].data.resolutions?.preview?.url
            return (
              <animated.div
                key={i}
                className="position-absolute w-100 h-100 top-0 d-flex align-items-center"
                style={{
                  opacity,
                }}
              >
                <figure style={{ width: '90%', height: '90%' }}>
                  <img src={coverSrc}></img>
                </figure>
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
                  {storyCovers[i] ? (
                    <figcaption className="mt-3 p-2 d-inline-flex align-items-center">
                      <div className="m-2 h-100">
                        <ArrowLeft size={12} />
                      </div>
                      <div className="m-2 h-100">
                        <em>{storyCovers[i].title}</em>
                        <br />
                        <DocumentDate doc={storyCovers[i]} language={language.split('_').shift()} />
                      </div>
                    </figcaption>
                  ) : null}
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
