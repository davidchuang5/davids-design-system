import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: ButtonVariant
  /** Size of the button — affects padding and font-size. */
  size?: ButtonSize
  /** When true renders a spinner and sets aria-busy; the button remains focusable. */
  loading?: boolean
  /** Icon rendered to the left of the label. */
  leadingIcon?: React.ReactNode
  /** Icon rendered to the right of the label. */
  trailingIcon?: React.ReactNode
  /** When true the button is visually and functionally disabled. */
  disabled?: boolean
}
