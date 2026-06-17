export type ProgressBarSize = 'sm' | 'md' | 'lg'

export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'danger'

export interface ProgressBarProps extends React.AriaAttributes {
  /** Current progress value. Ignored when `indeterminate` is true. */
  value?: number
  /** Maximum value. Defaults to 100. */
  max?: number
  /** Renders an animated indeterminate state when true. */
  indeterminate?: boolean
  /** Visual size of the track. */
  size?: ProgressBarSize
  /** Color variant for semantic feedback. */
  variant?: ProgressBarVariant
  /** Visible label rendered above the track. */
  label?: string
  /** When true, a percentage string is shown to the right of the label row. */
  showValueLabel?: boolean
  /** Additional CSS class applied to the root wrapper element. */
  className?: string
  /** Inline style applied to the root wrapper element. */
  style?: React.CSSProperties
  /** id forwarded to the inner [role="progressbar"] element. */
  id?: string
}
