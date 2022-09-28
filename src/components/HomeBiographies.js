import React, { useEffect, useRef } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumnLayout } from '../constants'
import StoryItem from './StoryItem'
import { StatusError, StatusSuccess, useGetJSON } from '../hooks/data'
import { shuffle } from '../logic/array'
import '../styles/components/HomeBiographies.css'
import { useTranslation } from 'react-i18next'
import { animated, useSpring, config } from 'react-spring'
import { useGesture } from '@use-gesture/react'
import { useBoundingClientRect } from '../hooks/viewport'

const HomeBiographies = ({ speed, availableWidth, availableHeight }) => {
  const { t } = useTranslation()
  const ref = useRef()
  const dragOffset = useRef(0)
  const slideOffsetLeft = useRef(0)
  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: config.molasses,
  }))
  const target = useRef()

  useEffect(() => {
    const handleScroll = () => {
      const pageYOffset = window.pageYOffset
      // get translatedOffset, that is the value to add because of parallax coeff "speed"
      const translatedOffset = speed * pageYOffset
      // use only slider visibility, which is ref to as "target"
      // const actualOffsetTop =
      //   ref.current.parentNode.offsetTop + translatedOffset + target.current.offsetTop
      const actualOffsetTop =
        ref.current.parentNode.offsetTop +
        translatedOffset +
        target.current.offsetTop +
        window.innerHeight * 0.1
      // target.current.scrollHeight
      // determine visibility of the "target" ref
      const isVisible =
        actualOffsetTop < pageYOffset + window.innerHeight && actualOffsetTop > pageYOffset // - target.current.scrollHeight
      // get visibility "ratio", value from 0 to 1. Goal: when the user passed the "target", he/she has viewed the full horizontal content of "target"
      // deprecated.
      // const ratio = Math.max(
      //   0,
      //   -(actualOffsetTop - pageYOffset - window.innerHeight) / window.innerHeight,
      // )
      console.debug('[HomeBiographies] @onScroll isVisible:', isVisible, dragOffset.current)
      //   ratio,
      //   ratio * (target.current.scrollWidth - window.innerWidth),
      //   // window.innerHeight + target.current.scrollHeight,
      //   // actualOffsetTop - pageYOffset + target.current.scrollHeight,
      //   // ref.current.parentNode.offsetTop,
      //   // pageYOffset - availableHeight,
      // )
      if (isVisible && dragOffset.current === 0) {
        slideOffsetLeft.current = -window.innerWidth
        // slideOffsetLeft.current = dragOffset.current !== 0 ? dragOffset.current : -window.innerWidth
        api.start({ x: -window.innerWidth })
      } else if (!isVisible && dragOffset.current !== 0) {
        // reset
        slideOffsetLeft.current = -window.innerWidth
        dragOffset.current = 0
        api.start({ x: -window.innerWidth })
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  console.info('[HomeBiographies] rendered, ', { availableWidth, availableHeight })

  const { data, status, error } = useGetJSON({
    url: '/api/story',
    params: {
      exclude: { tags__name: 'static' },
    },
  })

  useGesture(
    {
      onDrag: ({ event, offset: [x], direction: [dx] }) => {
        event.preventDefault()

        if (dx) {
          dragOffset.current = slideOffsetLeft.current + x
          console.info('[HomeBiographies]', x, dx)
          api.start({ x: slideOffsetLeft.current + x })
        }
        //   runSprings(wheelOffset.current + -x, -dx)
        // }
      },
    },
    { target },
  )

  if (status === StatusError) {
    console.error('[HomeBiographies] error in reading api:', status, data, error)
    return null
  }
  return (
    <div
      ref={ref}
      style={{ width: availableWidth, height: availableHeight }}
      className="HomeBiographies"
    >
      <Container>
        <Row>
          <Col {...BootstrapColumnLayout}>
            <h2 className="display-outlined">biographies</h2>
          </Col>
        </Row>
      </Container>

      <animated.ol ref={target} style={{ x }}>
        <li className="invisible" style={{ minWidth: availableWidth }}>
          empty
        </li>
        {status === StatusSuccess
          ? shuffle(data.results).map((story) => (
              <li key={story.slug}>
                <StoryItem reduced story={story} className="my-3" />
              </li>
            ))
          : null}
        <li className="invisible" style={{ minWidth: availableWidth }}>
          empty
        </li>
      </animated.ol>
    </div>
  )
}

export default HomeBiographies
