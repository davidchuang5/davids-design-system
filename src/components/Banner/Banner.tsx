import React from 'react'
import styles from './Banner.module.css'
import type { BannerProps, BannerVariant } from './types'

// ---------------------------------------------------------------------------
// Built-in variant icons (inline SVG, no external dependency)
// ---------------------------------------------------------------------------

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 3a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0v-4a1 1 0 0 0-1-1Z"
    />
  </svg>
)

const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z"
    />
  </svg>
)

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
    />
  </svg>
)

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
    />
  </svg>
)

const DismissIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
)

// ---------------------------------------------------------------------------
// Default icon map
// ---------------------------------------------------------------------------

const DEFAULT_ICONS: Record<BannerVariant, React.ReactElement> = {
  info:    <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error:   <ErrorIcon />,
}

// ---------------------------------------------------------------------------
// Aria-live defaults per variant
// ---------------------------------------------------------------------------

const DEFAULT_LIVE: Record<BannerVariant, 'polite' | 'assertive'> = {
  info:    'polite',
  success: 'polite',
  warning: 'assertive',
  error:   'assertive',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Banner
 *
 * A full-width notification strip used to communicate feedback, status, or
 * system alerts. Supports four semantic variants (info / success / warning /
 * error), an optional title, a leading icon slot, a trailing action slot, and
 * an optional dismiss button.
 *
 * Accessibility:
 * - Renders as role="alert" for error/warning (assertive) and role="status"
 *   for info/success (polite) so assistive technologies announce the message
 *   at the correct urgency level.
 * - The dismiss button has an accessible label and is keyboard-operable.
 * - Pass aria-label to the root when the banner lacks visible text.
 */
const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      variant = 'info',
      size = 'md',
      title,
      icon,
      action,
      dismissible = false,
      onDismiss,
      dismissLabel = 'Dismiss',
      live,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Resolve the icon node.
    // icon === null  → no icon rendered (explicitly suppressed).
    // icon === undefined → render the built-in default.
    // icon === <node>    → render whatever the consumer provided.
    const resolvedIcon = icon === null ? null : (icon ?? DEFAULT_ICONS[variant])
    const hasIcon = resolvedIcon !== null

    // aria-live / role resolution
    const liveValue = live ?? DEFAULT_LIVE[variant]
    const roleValue = liveValue === 'assertive' ? 'alert' : 'status'

    // Keyboard handler for dismiss: Enter and Space both trigger onDismiss.
    const handleDismissKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onDismiss?.()
      }
    }

    const rootClassNames = [
      styles.banner,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      !hasIcon && styles['no-icon'],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        role={roleValue}
        aria-live={liveValue}
        aria-atomic="true"
        className={rootClassNames}
        {...props}
      >
        {/* Icon column — omitted when explicitly suppressed */}
        {hasIcon && (
          <span className={styles.icon} aria-hidden="true">
            {resolvedIcon}
          </span>
        )}

        {/* Content column */}
        <div className={styles.content}>
          {title && <p className={styles.title}>{title}</p>}
          {children && <p className={styles.body}>{children}</p>}
          {action && <div className={styles.action}>{action}</div>}
        </div>

        {/* Dismiss column — omitted when not dismissible */}
        {dismissible && (
          <button
            type="button"
            className={styles.dismiss}
            aria-label={dismissLabel}
            onClick={onDismiss}
            onKeyDown={handleDismissKeyDown}
          >
            <DismissIcon />
          </button>
        )}
      </div>
    )
  },
)

Banner.displayName = 'Banner'

export { Banner }
export default Banner
