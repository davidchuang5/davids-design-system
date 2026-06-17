import React from 'react'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputVariant = 'default' | 'filled' | 'ghost'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual variant of the input field */
  variant?: InputVariant
  /** Controls padding, font-size, and icon sizing */
  size?: InputSize
  /** Visible label rendered above the input */
  label?: string
  /** id forwarded to the <input>; auto-generated when omitted so label/input are always linked */
  id?: string
  /** Helper text displayed below the input in a neutral tone */
  helperText?: string
  /** When provided the input enters an error state and this message replaces helperText */
  errorText?: string
  /** Renders a node (e.g. an icon) inside the leading edge of the input */
  leadingIcon?: React.ReactNode
  /** Renders a node (e.g. an icon) inside the trailing edge of the input */
  trailingIcon?: React.ReactNode
  /** Marks the field as required and appends an asterisk to the label */
  required?: boolean
  /** Visually fills the full width of its container */
  fullWidth?: boolean
}
