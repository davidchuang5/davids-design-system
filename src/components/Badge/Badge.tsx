import React from 'react'
import styles from './Badge.module.css'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual style variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg'
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = 'default', size = 'md', className, children, ...props },
    ref
  ) => {
    const variantClass = styles[`variant-${variant}`]
    const sizeClass = styles[`size-${size}`]

    return (
      <span
        ref={ref}
        className={`${styles.badge} ${variantClass} ${sizeClass} ${
          className || ''
        }`.trim()}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
export default Badge
