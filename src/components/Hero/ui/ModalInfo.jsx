import { Modal } from 'react-bootstrap'
import { usePebblesStore } from '../store'
import { useTranslation } from 'react-i18next'

const ModalInfo = () => {
  const { t } = useTranslation()
  const [showInfoModal, setShowInfoModal] = usePebblesStore((state) => [
    state.showInfoModal,
    state.setShowInfoModal,
  ])
  const handleClose = () => setShowInfoModal(false)
  return (
    <Modal show={showInfoModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modalInfoTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p
          dangerouslySetInnerHTML={{
            __html: t('modalInfoTextHtml'),
          }}
        ></p>
      </Modal.Body>
    </Modal>
  )
}
export default ModalInfo
