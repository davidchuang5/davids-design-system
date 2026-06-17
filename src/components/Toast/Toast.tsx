import React from 'react'
import styles from './Toast.module.css'
import type { ToastContainerProps, ToastProps, ToastVariant } from './types'

// ---------------------------------------------------------------------------
// SVG icon helpers — inline to avoid an external icon-library dependency.
// Each returns a 20×20 accessible SVG.
// ---------------------------------------------------------------------------

const InfoIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 9v5M10 7h.01"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const SuccessIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M6.5 10.5l2.5 2.5 4.5-5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const WarningIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.134 3.518a1 1 0 0 1 1.732 0l7.268 12.588A1 1 0 0 1 17.268 18H2.732a1 1 0 0 1-.866-1.494L9.134 3.518Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M10 8.5V12M10 14h.01"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ErrorIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7.5 7.5l5 5M12.5 7.5l-5 5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5 1.5l11 11M12.5 1.5l-11 11"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

const ICONS: Record<ToastVariant, React.ReactElement> = {
  info:    <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error:   <ErrorIcon />,
}

const DEFAULT_TITLES: Record<ToastVariant, string> = {
  info:    'Info',
  success: 'Success',
  warning: 'Warning',
  error:   'Error',
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

/**
 * Toast — a transient, non-blocking notification message.
 *
 * Auto-dismisses after `duration` ms (default 5000). Pass `duration={null}`
 * or `duration={0}` to keep the toast until the user explicitly closes it.
 *
 * Place one or more <Toast> elements inside a <ToastContainer> for correct
 * positioning and stacking.
 */
const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      variant = 'info',
      size = 'md',
      message,
      description,
      title,
      duration = 5000,
      closable = true,
      onClose,
      open = true,
      className,
      ...rest
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(open)
    const [closing, setClosing] = React.useState(false)
    const dismissTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const animationDuration = 180 // must match @keyframes toastSlideOut duration

    // Sync external `open` prop
    React.useEffect(() => {
      if (open && !visible) {
        setClosing(false)
        setVisible(true)
      } else if (!open && visible) {
        triggerClose()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    // Auto-dismiss
    React.useEffect(() => {
      if (!visible || !duration) return
      dismissTimerRef.current = setTimeout(triggerClose, duration)
      return () => {
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, duration])

    function triggerClose() {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
      setClosing(true)
      setTimeout(() => {
        setVisible(false)
        onClose?.()
      }, animationDuration)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        triggerClose()
      }
    }

    if (!visible) return null

    const resolvedTitle = title ?? DEFAULT_TITLES[variant]

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        data-variant={variant}
        data-size={size}
        data-closing={closing ? 'true' : undefined}
        className={[styles.toast, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {/* Variant icon */}
        <span className={styles.icon} aria-hidden="true">
          {ICONS[variant]}
        </span>

        {/* Text body */}
        <div className={styles.body}>
          <p className={styles.title}>{resolvedTitle}</p>
          <p className={styles.message}>{message}</p>
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>

        {/* Close button */}
        {closable && (
          <button
            type="button"
            aria-label="Dismiss notification"
            className={styles.closeButton}
            onClick={triggerClose}
            onKeyDown={handleKeyDown}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    )
  },
)

Toast.displayName = 'Toast'

// ---------------------------------------------------------------------------
// ToastContainer
// ---------------------------------------------------------------------------

/**
 * ToastContainer — fixed viewport anchor that stacks Toast children.
 *
 * Renders a visually hidden accessible label so screen-reader users
 * understand the region purpose.
 */
const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ position = 'top-right', children, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        data-position={position}
        className={[styles.container, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

ToastContainer.displayName = 'ToastContainer'

export { Toast, ToastContainer }
export default Toast
