import { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import downsize from 'downsize'
import { useStore } from '../store'
import { useDate } from '../hooks/date'

import '../styles/components/PeopleCard.css'
import { ArrowRightCircle } from 'react-feather'
import LangLink from './LangLink'

const PeopleCard = ({ debug, ...props }) => {
  const { t, i18n } = useTranslation()
  const { parseDate } = useDate({ language: i18n.language.split('_').join('-') })
  const selectedPebble = useStore((state) => state.selectedPebble)
  const [animate, setAnimate] = useState(false) //state used to add/remove animation-name parameter from the card
  const [firstAnim, setFirst] = useState(true) //state used to add/remove first-time animation from the card
  const [newValue, setValue] = useState(null)
  /*
  newValue copies selectedPebble value, BUT its value is updated 1.35s after the selectedPebble is updated,
  in order to simulate a smooth animation(check PeopleCard.css, animation-name: cardAnimation)
  */
  useLayoutEffect(() => {
    //Changing card title value using timeout in order to let it fadeOut with old value and then change its value and fadeIn
    let t1
    let t2
    if (firstAnim) {
      //Check if the card was animated for the first time, if not run first-time animation
      if (selectedPebble != null) {
        setValue(selectedPebble) //setting newValue for the first time
        setTimeout(() => {
          setFirst(false) //first time animation finished
          return
        }, 2500)
      }
    }
    clearTimeout(t1)
    clearTimeout(t2)
    if (selectedPebble != null) {
      setAnimate(true) //Starting animation if the selectedPebble is not null
    }
    t1 = setTimeout(() => {
      //timeout that changes card title when it faded out
      if (selectedPebble) {
        setValue(selectedPebble)
      }
    }, 1350)
    t2 = setTimeout(() => {
      //timeout that removes animation-name parameter from the card when the animation is over
      if (selectedPebble) {
        setAnimate(false)
      }
    }, 2500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [selectedPebble])

  if (!selectedPebble || !newValue) {
    return null
  }
  if (!debug) {
    return null
  }
  return (
    <div
      className={`PeopleCard ${animate ? 'cardAnimation' : ''} ${
        firstAnim ? 'cardAnimationIN' : ''
      }`}
      {...props}
    >
      {/* <img src={src} alt={alt}></img> */}

      <div className="Wrapper">
        <div className="TextWrapper">
          <h3
            dangerouslySetInnerHTML={{
              __html: downsize(newValue.title, { characters: 50, append: '&hellip;' }),
            }}
          />
          <span className="pt-2">{t('pebbleCreatedAt', { d: parseDate('2022-12-10') })}</span>
        </div>
        {/* <p>Jeanne Lukmanski was born in 1920 in Cornellà de Llobregregat (Spain).</p> */}
        <LangLink className="btn btn-md PeopleCard_btn" to={`/story/${newValue.slug}`}>
          <b className="me-2">{t('actionReadBiography')}</b> <ArrowRightCircle />
        </LangLink>
      </div>
    </div>
  )
}

export default PeopleCard
