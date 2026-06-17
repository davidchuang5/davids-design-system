import React from 'react'

// ─── Single RadioButton ───────────────────────────────────────────────────────

export type RadioButtonSize = 'sm' | 'md' | 'lg'

export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Text label rendered beside the radio control */
  label: string
  /** Visual + functional size of the control */
  size?: RadioButtonSize
  /** Marks the radio as checked (controlled) */
  checked?: boolean
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean
  /** Disables interaction and applies muted styling */
  disabled?: boolean
  /** Associates this radio with a named group */
  name?: string
  /** The value submitted with the form */
  value?: string
  /** Called when the radio's checked state changes */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

// ─── RadioGroup ──────────────────────────────────────────────────────────────

export interface RadioGroupOption {
  /** Unique value for this option */
  value: string
  /** Human-readable label */
  label: string
  /** Disables this individual option */
  disabled?: boolean
}

export interface RadioGroupProps {
  /** Accessible name for the entire group */
  label: string
  /** Name attribute shared across all radios in the group */
  name: string
  /** Controlled value of the selected option */
  value?: string
  /** Default selected value (uncontrolled) */
  defaultValue?: string
  /** Array of radio options to render */
  options: RadioGroupOption[]
  /** Visual + functional size applied to every radio in the group */
  size?: RadioButtonSize
  /** Disables every radio in the group */
  disabled?: boolean
  /** Layout direction */
  orientation?: 'horizontal' | 'vertical'
  /** Called when the selected option changes, receives the new value string */
  onChange?: (value: string) => void
  /** Additional className applied to the group wrapper */
  className?: string
}
