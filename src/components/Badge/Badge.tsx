import React from 'react'
import styles from './Badge.module.css'
import type { BadgeProps } from './types'

/**
 * Badge
 *
 * An inline status label used to call out short, categorical information
 * such as counts, states, or labels. Supports multiple semantic variants
 * and three sizes drawn entirely from puma-ui design tokens.
 *
 * Accessibility:
 * - Renders as a <span> with role="status" by default so assistive
 *   technologies announce dynamic updates without moving focus.
 * - Pass `aria-label` when the visible text is ambiguous (e.g. "3").
 * - Pass `role="img"` + `aria-label` for purely decorative badges that
 *   represent a named concept (e.g. a coloured dot).
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      role = 'status',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const classNames = [
      styles.badge,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <span ref={ref} role={role} className={classNames} {...props}>
        {children}
      </span>
    )
  },
)

Badge.displayName = 'Badge'

export { Badge }
export default Badge
