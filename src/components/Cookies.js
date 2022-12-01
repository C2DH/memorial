import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Container } from 'react-bootstrap'
import { usePermanentStore } from '../store'
import { TermsOfUseRoute } from '../constants'
import LangLink from './LangLink'
import styles from '../styles/components/Cookie.css'
import { useTimeout } from '../hooks/timeout'

const Cookies = ({ defaultAcceptCookies }) => {
  const [isStoreReady, setStoreReady] = useState(false)
  const acceptCookies = usePermanentStore((state) => state.acceptCookies)
  const acceptAnalyticsCookies = usePermanentStore((state) => state.acceptAnalyticsCookies)
  const setAcceptCookies = usePermanentStore((state) => state.setAcceptCookies)
  const setAcceptAnalyticsCookies = usePermanentStore((state) => state.setAcceptAnalyticsCookies)
  const { t } = useTranslation()
  const handleChange = (e) => {
    setAcceptAnalyticsCookies(e.target.checked)
  }
  const handleClickAgree = () => {
    setAcceptCookies()
  }
  console.debug(
    '[Cookies] \n - isStoreReady:',
    isStoreReady,
    '\n - defaultAcceptCookies:',
    defaultAcceptCookies,
  )

  useTimeout(() => {
    setStoreReady(true)
  }, 2000)

  if (defaultAcceptCookies || !isStoreReady) {
    return null
  }
  console.debug('[Cookies] \n - acceptCookies:', acceptCookies)
  if (acceptCookies) {
    return null
  }
  return (
    <div
      className="Cookies__main"
      style={{
        position: 'fixed',
        bottom: 0,
        background: 'var(--bs-dark)',
        color: 'white',
        width: '100%',
        zIndex: 1060,
      }}
    >
      <Container className="py-4">
        <p className="Cookies__disclaimer">
          We uses cookies and other data to deliver, maintain and improve the platform (
          <b>"functional" cookies</b>).
          {/*
              <pre style={{color: 'white'}}>{JSON.stringify({acceptCookies, acceptAnalyticsCookies})}</pre>
            */}
        </p>
        <Form>
          <Form.Switch
            id="agree-analytics-data"
            label="I also agree sending analytics data"
            checked={acceptAnalyticsCookies === true}
            onChange={handleChange}
          />
        </Form>
        <p className={styles.agreement}>
          By browsing this website you agree to our cookie policy. Visit{' '}
          <LangLink to={TermsOfUseRoute.to}>{t(TermsOfUseRoute.label)}</LangLink> to review your
          options later.
        </p>
        <div className="mx-3 my-0 my-md-3">
          <Button className={styles.AgreeButton} onClick={handleClickAgree}>
            Agree
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default Cookies
