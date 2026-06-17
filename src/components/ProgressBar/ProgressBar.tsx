import React from 'react'
import styles from './ProgressBar.module.css'
import type { ProgressBarProps } from './types'

/**
 * ProgressBar
 *
 * Displays determinate or indeterminate progress using the WAI-ARIA
 * progressbar role.  All visual tokens are sourced from variables.css.
 *
 * @example
 * // Determinate
 * <ProgressBar value={40} max={100} label="Uploading" showValueLabel />
 *
 * @example
 * // Indeterminate
 * <ProgressBar indeterminate label="Loading…" />
 */
const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      max = 100,
      indeterminate = false,
      size = 'md',
      variant = 'default',
      label,
      showValueLabel = false,
      className,
      style,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...ariaRest
    },
    ref,
  ) => {
    // Clamp value to [0, max] so the fill never overflows.
    const clampedValue = Math.min(Math.max(0, value), max)
    const percentage = max > 0 ? (clampedValue / max) * 100 : 0
    const percentageString = `${Math.round(percentage)}%`

    // The label element id is used for aria-labelledby when a visible label
    // is present and no explicit aria-labelledby prop has been supplied.
    const labelId = id ? `${id}-label` : undefined
    const resolvedLabelledBy = ariaLabelledby ?? (label ? labelId : undefined)

    // Inline custom property drives the CSS fill width transition.
    const fillStyle = indeterminate
      ? undefined
      : ({ '--_progress-width': percentageString } as React.CSSProperties)

    return (
      <div
        ref={ref}
        className={[styles.root, className].filter(Boolean).join(' ')}
        style={style}
      >
        {/* Label row — only rendered when a label or value label is requested */}
        {(label || showValueLabel) && (
          <div className={styles.labelRow}>
            {label && (
              <span
                id={labelId}
                className={styles.label}
              >
                {label}
              </span>
            )}
            {showValueLabel && !indeterminate && (
              <span className={styles.valueLabel} aria-hidden="true">
                {percentageString}
              </span>
            )}
          </div>
        )}

        {/* Track */}
        <div
          className={[styles.track, styles[`track--${size}`]].join(' ')}
        >
          {/* ARIA progressbar lives on the fill element so screen readers
              announce progress changes via aria-valuenow updates. */}
          <div
            id={id}
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : clampedValue}
            aria-valuemin={indeterminate ? undefined : 0}
            aria-valuemax={indeterminate ? undefined : max}
            aria-label={ariaLabel ?? (!label ? 'Progress' : undefined)}
            aria-labelledby={resolvedLabelledBy}
            aria-busy={indeterminate || undefined}
            aria-valuetext={
              indeterminate ? 'Loading' : `${percentageString}`
            }
            className={[
              styles.fill,
              styles[`fill--${variant}`],
              indeterminate ? styles['fill--indeterminate'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={fillStyle}
            {...ariaRest}
          />
        </div>
      </div>
    )
  },
)

ProgressBar.displayName = 'ProgressBar'

export { ProgressBar }
export default ProgressBar
