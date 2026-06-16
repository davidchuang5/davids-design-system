import styles from './Modal.module.css'
import React, { useEffect, useRef } from 'react'

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
  title?: string | React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      children,
      footer,
      closeOnEscape = true,
      closeOnOverlayClick = true,
      className,
      ...props
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return

      if (open) {
        dialog.showModal()
      } else {
        dialog.close()
      }
    }, [open])

    useEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return

      const handleCancel = (event: Event) => {
        if (closeOnEscape) {
          event.preventDefault()
          onClose()
        }
      }

      const handleClose = () => {
        onClose()
      }

      dialog.addEventListener('cancel', handleCancel)
      dialog.addEventListener('close', handleClose)

      return () => {
        dialog.removeEventListener('cancel', handleCancel)
        dialog.removeEventListener('close', handleClose)
      }
    }, [onClose, closeOnEscape])

    const handleOverlayClick = (event: React.MouseEvent<HTMLDialogElement>) => {
      if (closeOnOverlayClick && event.target === dialogRef.current) {
        onClose()
      }
    }

    return (
      <dialog
        ref={dialogRef}
        className={`${styles.modal} ${className || ''}`}
        onClick={handleOverlayClick}
        {...props}
      >
        <div className={styles.content}>
          {title && (
            <div className={styles.header}>
              <h2 className={styles.title}>{title}</h2>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
                type="button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {children && <div className={styles.body}>{children}</div>}

          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </dialog>
    )
  }
)

Modal.displayName = 'Modal'

export { Modal }
export default Modal
