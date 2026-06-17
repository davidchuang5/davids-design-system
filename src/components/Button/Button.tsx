import React from 'react'
import styles from './Button.module.css'
import type { ButtonProps } from './types'

/**
 * Button — puma-ui design system
 *
 * Supports three visual variants (primary / secondary / ghost), three sizes
 * (sm / md / lg), optional leading and trailing icon slots, and a loading
 * state that blocks interaction while retaining focus-ability.
 *
 * All styling is driven by CSS custom properties defined in variables.css;
 * no color, spacing, or radii values are hardcoded.
 *
 * @example
 * <Button variant="primary" size="md" leadingIcon={<SearchIcon />}>
 *   Search
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leadingIcon,
      trailingIcon,
      children,
      className,
      onClick,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    const rootClass = [
      styles.button,
      styles[variant],
      styles[size],
      loading ? styles.loading : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')

    /**
     * Guard clicks when logically disabled (loading or disabled prop).
     * We keep the element interactive in the DOM (no HTML disabled attr when
     * loading) so screen readers can still announce the busy state.
     */
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault()
        return
      }
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type={type}
        className={rootClass}
        disabled={disabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        onClick={handleClick}
        {...rest}
      >
        {/* Spinner overlaid in the center during loading */}
        {loading && (
          <span
            className={styles.spinner}
            aria-hidden="true"
            data-testid="button-spinner"
          />
        )}

        {/* Visible content — fades out while loading */}
        <span className={styles.inner}>
          {leadingIcon && (
            <span className={styles.iconSlot} aria-hidden="true">
              {leadingIcon}
            </span>
          )}

          {children}

          {trailingIcon && (
            <span className={styles.iconSlot} aria-hidden="true">
              {trailingIcon}
            </span>
          )}
        </span>
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button }
export default Button
