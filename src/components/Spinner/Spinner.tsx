import React from 'react'
import styles from './Spinner.module.css'
import type { SpinnerProps } from './types'

/**
 * Spinner
 *
 * An accessible, animated loading indicator for the puma-ui design system.
 *
 * Accessibility contract:
 * - The host <span> carries role="status" so assistive technologies announce
 *   live-region updates without interrupting the user.
 * - aria-label is rendered on the host so the spinner is discoverable and
 *   described even when it appears without surrounding text.
 * - A visually-hidden <span> duplicates the label text so non-AT users who
 *   inspect the DOM can also read the intent.
 * - aria-live="polite" on the host means the announcement is non-intrusive.
 *
 * Usage:
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" variant="onDark" label="Saving your changes…" />
 * ```
 */
const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'primary',
      label = 'Loading…',
      className,
      ...rest
    },
    ref
  ) => {
    const rootClasses = [
      styles.spinner,
      styles[size],
      styles[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <span
        ref={ref}
        role="status"
        aria-label={label}
        aria-live="polite"
        aria-busy="true"
        className={rootClasses}
        {...rest}
      >
        {/* Visually-hidden text for DOM inspection and additional AT support */}
        <span className={styles.srOnly}>{label}</span>
      </span>
    )
  }
)

Spinner.displayName = 'Spinner'

export { Spinner }
export default Spinner
