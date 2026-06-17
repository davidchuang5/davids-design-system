import React, { useId } from 'react'
import styles from './Input.module.css'
import type { InputProps } from './types'

const sizeClass: Record<NonNullable<InputProps['size']>, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

const variantClass: Record<NonNullable<InputProps['variant']>, string> = {
  default: '',
  filled: styles.variantFilled,
  ghost: styles.variantGhost,
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      label,
      id: idProp,
      helperText,
      errorText,
      leadingIcon,
      trailingIcon,
      required = false,
      fullWidth = false,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    // Stable auto-generated id so label always stays linked even without an explicit id prop
    const generatedId = useId()
    const inputId = idProp ?? generatedId
    const helperId = `${inputId}-helper`
    const errorId = `${inputId}-error`

    const hasError = Boolean(errorText)
    const descriptionId = hasError ? errorId : helperText ? helperId : undefined

    const wrapperClasses = [
      styles.wrapper,
      sizeClass[size],
      variantClass[variant],
      fullWidth ? styles.fullWidth : '',
      leadingIcon ? styles.hasLeadingIcon : '',
      trailingIcon ? styles.hasTrailingIcon : '',
    ]
      .filter(Boolean)
      .join(' ')

    const fieldRowClasses = [
      styles.fieldRow,
      hasError ? styles.fieldRowError : '',
      disabled ? styles.fieldRowDisabled : '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div
          className={fieldRowClasses}
          // Convey the error state to AT at the container level as well
          aria-invalid={hasError ? true : undefined}
        >
          {leadingIcon && (
            <span className={styles.iconSlot} aria-hidden="true">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[styles.input, className].filter(Boolean).join(' ')}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={descriptionId}
            {...rest}
          />

          {trailingIcon && (
            <span className={styles.iconSlot} aria-hidden="true">
              {trailingIcon}
            </span>
          )}
        </div>

        {hasError ? (
          <span id={errorId} className={`${styles.subText} ${styles.errorText}`} role="alert">
            {errorText}
          </span>
        ) : helperText ? (
          <span id={helperId} className={`${styles.subText} ${styles.helperText}`}>
            {helperText}
          </span>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
export default Input
