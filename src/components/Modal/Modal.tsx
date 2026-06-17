import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react'
import ReactDOM from 'react-dom'
import styles from './Modal.module.css'
import type { ModalProps } from './types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns an array of all keyboard-focusable elements inside a container. */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), ' +
        'input:not([disabled]), select:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])',
    ),
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      size = 'md',
      disableBackdropClose = false,
      disableEscClose = false,
      header,
      children,
      footer,
      className,
      style,
      'aria-label': ariaLabel,
    },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null)
    const previouslyFocusedRef = useRef<HTMLElement | null>(null)

    // Auto-generated id so we can wire up aria-labelledby when a header exists
    const headingId = useId()

    // -------------------------------------------------------------------------
    // ESC key handler
    // -------------------------------------------------------------------------
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (!open) return

        if (event.key === 'Escape' && !disableEscClose) {
          event.stopPropagation()
          onClose()
          return
        }

        // Focus trap — keep Tab cycling inside the dialog
        if (event.key === 'Tab' && dialogRef.current) {
          const focusable = getFocusableElements(dialogRef.current)
          if (focusable.length === 0) {
            event.preventDefault()
            return
          }

          const first = focusable[0]
          const last = focusable[focusable.length - 1]

          if (event.shiftKey) {
            if (document.activeElement === first) {
              event.preventDefault()
              last.focus()
            }
          } else {
            if (document.activeElement === last) {
              event.preventDefault()
              first.focus()
            }
          }
        }
      },
      [open, disableEscClose, onClose],
    )

    // -------------------------------------------------------------------------
    // Lifecycle — focus management + keyboard listener
    // -------------------------------------------------------------------------
    useEffect(() => {
      if (open) {
        // Remember what had focus before we opened
        previouslyFocusedRef.current = document.activeElement as HTMLElement

        // Move focus into the dialog on the next tick so the portal is rendered
        const raf = requestAnimationFrame(() => {
          if (dialogRef.current) {
            const focusable = getFocusableElements(dialogRef.current)
            if (focusable.length > 0) {
              focusable[0].focus()
            } else {
              dialogRef.current.focus()
            }
          }
        })

        document.addEventListener('keydown', handleKeyDown)

        // Prevent background scroll
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
          cancelAnimationFrame(raf)
          document.removeEventListener('keydown', handleKeyDown)
          document.body.style.overflow = previousOverflow

          // Restore focus to the element that was active before the modal opened
          if (previouslyFocusedRef.current) {
            previouslyFocusedRef.current.focus()
          }
        }
      }
    }, [open, handleKeyDown])

    // -------------------------------------------------------------------------
    // Backdrop click
    // -------------------------------------------------------------------------
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      // Only fire if the click landed directly on the backdrop overlay, not on
      // any child element inside the dialog panel.
      if (event.target === event.currentTarget && !disableBackdropClose) {
        onClose()
      }
    }

    // -------------------------------------------------------------------------
    // Render — skip entirely when closed (no DOM cost)
    // -------------------------------------------------------------------------
    if (!open) return null

    const dialog = (
      <div
        className={`${styles.backdrop} ${open ? styles.backdropVisible : ''}`}
        onClick={handleBackdropClick}
        // Backdrop itself is presentational; the dialog role is on the panel
        aria-hidden="false"
      >
        <div
          ref={(node) => {
            // Merge forwardRef with our internal ref
            dialogRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ;(ref as React.MutableRefObject<HTMLDivElement | null>).current =
                node
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label={!header ? ariaLabel : undefined}
          aria-labelledby={header ? headingId : undefined}
          tabIndex={-1}
          className={[
            styles.panel,
            styles[`size-${size}`],
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={style}
        >
          {/* ---- Header ---------------------------------------------------- */}
          {header && (
            <div className={styles.header}>
              <div id={headingId} className={styles.headerTitle}>
                {header}
              </div>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close modal"
                onClick={onClose}
              >
                {/* Simple × glyph — no icon dependency */}
                <span aria-hidden="true">&#x2715;</span>
              </button>
            </div>
          )}

          {/* ---- Body ------------------------------------------------------ */}
          <div className={styles.body}>{children}</div>

          {/* ---- Footer ---------------------------------------------------- */}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    )

    // Render into a portal so the modal sits outside the normal DOM hierarchy
    return ReactDOM.createPortal(dialog, document.body)
  },
)

Modal.displayName = 'Modal'

export { Modal }
export default Modal
