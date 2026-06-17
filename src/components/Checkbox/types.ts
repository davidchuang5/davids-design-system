import React from 'react'

export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Visible label rendered beside the checkbox control */
  label?: string
  /** Associates an external element's id as the label via aria-labelledby */
  labelledBy?: string
  /** Size of the checkbox control and label text */
  size?: CheckboxSize
  /** Puts the checkbox in an indeterminate (mixed) state */
  indeterminate?: boolean
  /** Renders the field in an error state with a red border */
  error?: boolean
  /** Helper or validation message rendered below the label */
  helperText?: string
}
