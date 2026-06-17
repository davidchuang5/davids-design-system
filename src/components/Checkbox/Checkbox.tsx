import React from 'react'
import styles from './Checkbox.module.css'
import type { CheckboxProps } from './types'

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      labelledBy,
      size = 'md',
      indeterminate = false,
      error = false,
      disabled = false,
      helperText,
      id,
      className,
      checked,
      defaultChecked,
      onChange,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null)

    // Merge the forwarded ref with the internal ref so we can set indeterminate
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef

    // The indeterminate property is not a real HTML attribute — it must be set
    // imperatively on the DOM node every render.
    React.useEffect(() => {
      const node = resolvedRef.current
      if (node) {
        node.indeterminate = indeterminate
      }
    }, [indeterminate, resolvedRef])

    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const helperId = helperText ? `${inputId}-helper` : undefined

    const rootClasses = [
      styles.root,
      styles[`size-${size}`],
      error ? styles.error : '',
      disabled ? styles.disabled : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={rootClasses}>
        <label
          htmlFor={inputId}
          className={styles.label}
        >
          <span className={styles.controlWrapper}>
            <input
              {...rest}
              ref={resolvedRef}
              id={inputId}
              type="checkbox"
              className={styles.input}
              checked={checked}
              defaultChecked={defaultChecked}
              disabled={disabled}
              onChange={onChange}
              aria-checked={indeterminate ? 'mixed' : checked}
              aria-disabled={disabled}
              aria-invalid={error ? true : undefined}
              aria-describedby={helperId}
              aria-label={!label && !labelledBy ? ariaLabel : undefined}
              aria-labelledby={labelledBy}
            />
            {/* Custom visual control — visible only to pointer/sighted users */}
            <span
              className={styles.control}
              aria-hidden="true"
            >
              {/* Checkmark SVG */}
              {!indeterminate && (
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  focusable="false"
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {/* Indeterminate dash */}
              {indeterminate && (
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  focusable="false"
                >
                  <path
                    d="M2.5 6H9.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          </span>

          {label && (
            <span className={styles.labelText}>{label}</span>
          )}
        </label>

        {helperText && (
          <p
            id={helperId}
            className={styles.helperText}
            role={error ? 'alert' : undefined}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
export default Checkbox
