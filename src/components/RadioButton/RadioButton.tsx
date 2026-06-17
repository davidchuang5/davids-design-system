import React from 'react'
import styles from './RadioButton.module.css'
import type { RadioButtonProps, RadioGroupProps } from './types'

// ─── RadioButton ──────────────────────────────────────────────────────────────

/**
 * A single accessible radio button with a custom-styled control and text label.
 *
 * - Forwards the ref to the underlying `<input type="radio">` element.
 * - Supports sm / md / lg sizes and a disabled state.
 * - Keyboard accessible out-of-the-box via native `<input>` semantics.
 */
const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      label,
      size = 'md',
      disabled = false,
      id,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    // Generate a stable id when the consumer does not supply one.
    const internalId = React.useId()
    const resolvedId = id ?? internalId

    return (
      <label
        htmlFor={resolvedId}
        className={[
          styles.wrapper,
          styles[`size-${size}`],
          disabled ? styles.disabled : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
      >
        {/*
         * The native input is visually hidden but remains fully interactive:
         * it handles focus, keyboard navigation, and form submission.
         */}
        <input
          {...rest}
          ref={ref}
          id={resolvedId}
          type="radio"
          disabled={disabled}
          className={styles.input}
          aria-disabled={disabled || undefined}
        />

        {/* Custom visual control */}
        <span className={styles.control} aria-hidden="true">
          <span className={styles.dot} />
        </span>

        {/* Label text */}
        <span className={styles.label}>{label}</span>
      </label>
    )
  }
)

RadioButton.displayName = 'RadioButton'

// ─── RadioGroup ───────────────────────────────────────────────────────────────

/**
 * Renders a group of RadioButton controls sharing the same `name`, with an
 * accessible `<fieldset>` / `<legend>` wrapper and optional controlled state.
 *
 * Orientation can be "vertical" (default) or "horizontal".
 */
const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      label,
      name,
      value: controlledValue,
      defaultValue,
      options,
      size = 'md',
      disabled = false,
      orientation = 'vertical',
      onChange,
      className,
    },
    ref
  ) => {
    // Internal state for the uncontrolled usage path.
    const [internalValue, setInternalValue] = React.useState<
      string | undefined
    >(defaultValue)

    const isControlled = controlledValue !== undefined
    const selectedValue = isControlled ? controlledValue : internalValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value)
      }
      onChange?.(e.target.value)
    }

    return (
      <fieldset
        ref={ref}
        role="radiogroup"
        aria-labelledby={`${name}-legend`}
        disabled={disabled}
        className={[styles.group, className ?? ''].filter(Boolean).join(' ')}
        style={{ border: 'none', padding: 0, margin: 0 }}
      >
        <legend id={`${name}-legend`} className={styles['group-label']}>
          {label}
        </legend>

        <div
          className={[
            styles['group-options'],
            orientation === 'horizontal'
              ? styles.horizontal
              : styles.vertical,
          ].join(' ')}
          role="presentation"
        >
          {options.map((option) => (
            <RadioButton
              key={option.value}
              name={name}
              label={option.label}
              value={option.value}
              size={size}
              disabled={disabled || option.disabled}
              checked={selectedValue === option.value}
              onChange={handleChange}
            />
          ))}
        </div>
      </fieldset>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

// ─── Exports ──────────────────────────────────────────────────────────────────

export { RadioButton, RadioGroup }
export default RadioButton
