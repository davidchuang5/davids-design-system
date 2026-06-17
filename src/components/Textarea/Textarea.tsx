/**
 * Textarea — puma-ui design system
 *
 * A multiline text input with an optional label, helper/error text,
 * live character counter, and configurable resize behaviour.
 *
 * Accessibility notes
 * -------------------
 * - The <label> is always associated with the <textarea> via htmlFor / id so
 *   screen readers announce the label when focus moves to the field.
 * - Helper and error text are wired to aria-describedby so they are read
 *   after the label in browse/form mode.
 * - aria-invalid="true" is set when errorText is present.
 * - aria-required is forwarded from the required prop.
 * - The live character counter uses aria-live="polite" so it does not
 *   interrupt the user's typing but is announced on pause.
 */

import React from 'react'
import styles from './Textarea.module.css'
import type { TextareaProps } from './types'

// Tiny id-generator — stable across re-renders, unique per instance.
let instanceCount = 0
function useStableId(externalId?: string): string {
  const [id] = React.useState<string>(
    () => externalId ?? `ds-textarea-${++instanceCount}`,
  )
  // If the consumer passes a new id after mount, honour it.
  return externalId ?? id
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      // Design-system props
      variant = 'default',
      size = 'md',
      label,
      id: externalId,
      helperText,
      errorText,
      required = false,
      fullWidth = false,
      showCharacterCount = false,
      resize = 'vertical',
      rows = 4,

      // Native textarea props we handle explicitly
      value,
      defaultValue,
      onChange,
      disabled,
      maxLength,
      className,

      // Remaining native props forwarded as-is
      ...rest
    },
    ref,
  ) => {
    // Controlled vs uncontrolled character tracking
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<string>(
      typeof defaultValue === 'string' ? defaultValue : '',
    )

    const currentValue = isControlled ? String(value ?? '') : internalValue
    const charCount = currentValue.length
    const isOver = maxLength !== undefined && charCount > maxLength

    const id = useStableId(externalId)
    const descriptionId = `${id}-description`
    const counterId = `${id}-counter`

    const hasFooter = Boolean(errorText ?? helperText ?? showCharacterCount)

    // Compose aria-describedby from available hint elements
    const describedByParts: string[] = []
    if (errorText ?? helperText) describedByParts.push(descriptionId)
    if (showCharacterCount) describedByParts.push(counterId)
    const ariaDescribedBy =
      describedByParts.length > 0 ? describedByParts.join(' ') : undefined

    // Internal onChange keeps uncontrolled state in sync
    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      if (!isControlled) {
        setInternalValue(e.target.value)
      }
      onChange?.(e)
    }

    // ---------------------------------------------------------------------------
    // Class composition
    // ---------------------------------------------------------------------------
    const rootClasses = [
      styles.root,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`resize-${resize}`],
      fullWidth ? styles.fullWidth : undefined,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const textareaClasses = [
      styles.textarea,
      errorText ? styles.textareaError : undefined,
    ]
      .filter(Boolean)
      .join(' ')

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return (
      <div className={rootClasses}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={[styles.label, disabled ? styles.disabled : undefined]
              .filter(Boolean)
              .join(' ')}
          >
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          aria-required={required || undefined}
          aria-invalid={errorText ? true : undefined}
          aria-describedby={ariaDescribedBy}
          className={textareaClasses}
          {...rest}
        />

        {/* Footer: helper/error text + optional counter */}
        {hasFooter && (
          <div className={styles.footer}>
            {/* Helper or error message */}
            {(errorText ?? helperText) && (
              <span
                id={descriptionId}
                className={errorText ? styles.errorMessage : styles.helperText}
                role={errorText ? 'alert' : undefined}
                aria-live={errorText ? 'assertive' : undefined}
              >
                {errorText ?? helperText}
              </span>
            )}

            {/* Character counter */}
            {showCharacterCount && (
              <span
                id={counterId}
                className={[
                  styles.characterCount,
                  isOver ? styles.characterCountOver : undefined,
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-live="polite"
                aria-atomic="true"
              >
                {maxLength !== undefined
                  ? `${charCount} / ${maxLength}`
                  : String(charCount)}
              </span>
            )}
          </div>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

export { Textarea }
export default Textarea
