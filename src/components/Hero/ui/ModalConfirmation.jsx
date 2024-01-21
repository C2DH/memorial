import { useMutation } from '@tanstack/react-query'
import { Form, Modal } from 'react-bootstrap'
import { usePebblesStore } from '../store'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * This React component is used to render the modal confirmation dialog and presents the user
 * with a field to send themselves an email with a link to the pebble they are creating.
 */
const ModalConfirmation = ({ disableEmail = false }) => {
  const { t } = useTranslation()
  const lastPebbleData = usePebblesStore((state) => state.lastPebbleData)
  const [showConfirmationModal, setShowConfirmationModal] = usePebblesStore((state) => [
    state.showConfirmationModal,
    state.setShowConfirmationModal,
  ])
  const userEmail = useRef('')
  const [formError, setFormError] = useState(null)
  const { status, mutate } = useMutation({
    mutationFn: (payload) => {
      console.debug('[ModalConfirmation] useMutation payload:', payload)
    },
  })

  const handleClose = () => setShowConfirmationModal(false)
  const sendEmail = (e) => {
    if (e) e.preventDefault()
    if (disableEmail) {
      console.debug('[ModalConfirmation] sendEmail disabled by disableEmail component prop')
      handleClose()
      return
    }
    if (status === 'loading') {
      console.warn('[ModalConfirmation] sendEmail already loading')
      return
    }
    // check that current email is valid email address with a nice regex
    if (!userEmail.current || !userEmail.current.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      console.error('[ModalConfirmation] sendEmail invalid email address', userEmail.current)
      setFormError('Invalid email address')
      return
    }
    console.debug('[ModalConfirmation] sendEmail', userEmail.current)
    mutate({
      email: userEmail.current,
      pebble: lastPebbleData.id,
    })
    handleClose()
  }

  return (
    <Modal show={showConfirmationModal} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modalConfirmationTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p dangerouslySetInnerHTML={{ __html: t('modalConfirmationParagraph') }} />
        {disableEmail ? null : (
          <Form onSubmit={sendEmail}>
            To receive a link to your pebble, please enter your email address below.
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => {
                  userEmail.current = e.target.value
                  if (formError) {
                    setFormError(null)
                  }
                }}
                autoFocus
                className={formError ? 'is-invalid' : null}
                placeholder="Enter email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else and we do not store it.
              </Form.Text>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      {disableEmail ? null : (
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button className="btn bt-primary" variant="primary" onClick={sendEmail}>
            {t('modalConfirmationSendEmail')}
          </button>
        </Modal.Footer>
      )}
    </Modal>
  )
}

export default ModalConfirmation
