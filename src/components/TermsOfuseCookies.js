import { Col, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { usePermanentStore } from '../store'

const TermsOfUseCookies = ({ defaultAcceptCookies }) => {
  const { t } = useTranslation()
  const acceptAnalyticsCookies = usePermanentStore((state) => state.acceptAnalyticsCookies)
  const setAcceptAnalyticsCookies = usePermanentStore((state) => state.setAcceptAnalyticsCookies)

  const handleChange = (e) => {
    setAcceptAnalyticsCookies(e.target.checked)
  }
  if (defaultAcceptCookies) {
    return null
  }
  return (
    <Col>
      <section className="pt-5 ps-3">
        <h3 className="my-5">{t('acceptAnalyticsCookies')}</h3>
        <Form>
          <Form.Switch
            id="agree-analytics-data"
            label={t('acceptAnalyticsCookiesLabel')}
            checked={acceptAnalyticsCookies === true}
            onChange={handleChange}
          />
        </Form>
        <div className="my-5 text-muted">{t('acceptAnalyticsCookiesDescription')}</div>
      </section>
    </Col>
  )
}

export default TermsOfUseCookies
