import React from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant of the button
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean
  /**
   * Whether the button is disabled
   */
  disabled?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    const classNames = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      loading && styles.loading,
      isDisabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        <span className={styles.content}>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export default Button
