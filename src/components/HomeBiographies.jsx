import React, { useEffect, useRef } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumnLayout } from '../constants'
import StoryItem from './StoryItem'
import { StatusError, StatusSuccess, useGetJSON } from '../hooks/data'
import { useTranslation } from 'react-i18next'
import { animated, useSpring, config } from 'react-spring'
import { useGesture } from '@use-gesture/react'
import '../styles/components/HomeBiographies.css'

const HomeBiographies = ({ isMobile, speed, availableWidth, availableHeight, className = '' }) => {
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
      if (!target.current || !ref.current) {
        return
      }
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
        api.start({ x: -window.innerWidth, config: config.molasses })
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [api, speed])

  console.info('[HomeBiographies] rendered, ', { availableWidth, availableHeight })

  const { data, status, error } = useGetJSON({
    url: '/api/story',
    params: {
      exclude: { tags__name: 'static' },
      filters: {
        slug__in: [
          '0076-grossvogel-macharowska',
          '0109-abraham-fredy',
          '0127-dorflaufer',
          '0010-adler-wolf-ermann',
          '0014-esther-meyer',
        ],
      },
      // orderby: '-date_last_modified',
    },
  })

  useGesture(
    {
      onDrag: ({ event, offset: [x], direction: [dx] }) => {
        event.preventDefault()

        if (dx) {
          dragOffset.current = slideOffsetLeft.current + x
          console.info('[HomeBiographies]', x, dx)
          if (isMobile) {
            api.start({ x: slideOffsetLeft.current + x, config: config.stiff })
          } else {
            api.start({ x: slideOffsetLeft.current + x, config: config.stiff })
          }
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
      className={`HomeBiographies ${className}`}
    >
      <Container>
        <Row>
          <Col {...BootstrapColumnLayout}>
            <h2 className="display-outlined">{t('latestBiographies')}</h2>
          </Col>
        </Row>
      </Container>

      <animated.ol ref={target} style={{ x }}>
        <li className="invisible" style={{ minWidth: availableWidth }}>
          empty
        </li>
        {status === StatusSuccess
          ? data.results.map((story) => (
              <li
                key={story.slug}
                className={`HomeBiographies_storyListItem ${
                  story.covers.length ? 'with-covers' : ''
                }`}
              >
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
