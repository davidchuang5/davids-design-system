import React from 'react'

export type ToggleSize = 'sm' | 'md'

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Controlled checked state. When provided, the component is controlled and
   * `onCheckedChange` must be used to update it.
   */
  checked?: boolean
  /**
   * Default checked state for uncontrolled usage.
   */
  defaultChecked?: boolean
  /**
   * Callback fired when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void
  /**
   * Visible label rendered beside the toggle track. When omitted, supply
   * `aria-label` or `aria-labelledby` directly.
   */
  label?: string
  /**
   * Positions the label relative to the toggle track.
   * @default 'right'
   */
  labelPosition?: 'left' | 'right'
  /**
   * Size variant of the toggle.
   * @default 'md'
   */
  size?: ToggleSize
  /**
   * Disables the toggle, preventing interaction.
   */
  disabled?: boolean
}
