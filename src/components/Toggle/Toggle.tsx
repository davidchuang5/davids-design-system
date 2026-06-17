import React from 'react'
import styles from './Toggle.module.css'
import type { ToggleProps } from './types'

/**
 * Toggle (switch) component for the puma-ui design system.
 *
 * Supports both controlled and uncontrolled usage:
 *   - Controlled:   supply `checked` + `onCheckedChange`
 *   - Uncontrolled: supply `defaultChecked` (or nothing for false)
 *
 * The underlying element is a visually-hidden `<input type="checkbox">` so
 * native form submission, keyboard interaction, and screen-reader semantics
 * are provided for free. The visible track + thumb are purely presentational.
 *
 * @example
 * // Uncontrolled
 * <Toggle label="Enable notifications" defaultChecked />
 *
 * @example
 * // Controlled
 * const [on, setOn] = React.useState(false)
 * <Toggle label="Dark mode" checked={on} onCheckedChange={setOn} />
 */
const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      label,
      labelPosition = 'right',
      size = 'md',
      disabled = false,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      className,
      onChange,
      ...rest
    },
    ref,
  ) => {
    // ------------------------------------------------------------------
    // Internal uncontrolled state — only used when `checked` is undefined
    // ------------------------------------------------------------------
    const [internalChecked, setInternalChecked] = React.useState(
      defaultChecked ?? false,
    )

    const isControlled = checked !== undefined
    const isChecked = isControlled ? checked : internalChecked

    // ------------------------------------------------------------------
    // Stable auto-generated id so the <label> can reference the input
    // ------------------------------------------------------------------
    const autoId = React.useId()
    const inputId = id ?? autoId

    // ------------------------------------------------------------------
    // Change handler — keeps internal state in sync for uncontrolled mode
    // and fires the consumer callback in both modes
    // ------------------------------------------------------------------
    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.checked
        if (!isControlled) {
          setInternalChecked(next)
        }
        onCheckedChange?.(next)
        onChange?.(event)
      },
      [isControlled, onChange, onCheckedChange],
    )

    // ------------------------------------------------------------------
    // CSS class composition
    // ------------------------------------------------------------------
    const sizeClass = size === 'sm' ? styles.sizeSm : styles.sizeMd
    const labelPositionClass =
      labelPosition === 'left' ? styles.labelLeft : undefined

    const wrapperClasses = [
      styles.wrapper,
      sizeClass,
      disabled ? styles.disabled : undefined,
      labelPositionClass,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // ------------------------------------------------------------------
    // Accessibility: when no visible label is present the consumer must
    // supply aria-label or aria-labelledby directly. We surface a dev
    // warning so this is never silently missed.
    // ------------------------------------------------------------------
    if (
      process.env.NODE_ENV !== 'production' &&
      !label &&
      !ariaLabel &&
      !ariaLabelledBy
    ) {
      console.warn(
        '[Toggle] No accessible label found. Supply a `label` prop, ' +
          '`aria-label`, or `aria-labelledby`.',
      )
    }

    return (
      <label
        htmlFor={inputId}
        className={wrapperClasses}
        // Prevent the outer label click from double-firing when the hidden
        // input already handles the toggle.
        onMouseDown={(e) => e.preventDefault()}
      >
        {/* Visually hidden native checkbox — owns all keyboard + a11y semantics */}
        <input
          {...rest}
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          className={styles.input}
          checked={isChecked}
          disabled={disabled}
          aria-checked={isChecked}
          aria-label={!label ? ariaLabel : undefined}
          aria-labelledby={!label ? ariaLabelledBy : undefined}
          onChange={handleChange}
        />

        {/* Visual track + thumb — purely presentational, aria-hidden */}
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>

        {/* Optional visible label */}
        {label && <span className={styles.label}>{label}</span>}
      </label>
    )
  },
)

Toggle.displayName = 'Toggle'

export { Toggle }
export default Toggle
