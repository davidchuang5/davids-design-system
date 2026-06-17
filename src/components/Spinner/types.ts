export type SpinnerSize = 'sm' | 'md' | 'lg'

export type SpinnerVariant = 'primary' | 'neutral' | 'onDark'

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Controls the diameter of the spinner ring.
   * sm = 16px, md = 24px, lg = 40px
   * @default 'md'
   */
  size?: SpinnerSize

  /**
   * Color variant drawn from design-system tokens.
   * primary  — warm-black track on a light surface
   * neutral  — warm sand track on a light surface
   * onDark   — warm-light track for use on dark backgrounds
   * @default 'primary'
   */
  variant?: SpinnerVariant

  /**
   * Accessible label announced by screen readers.
   * Pass a meaningful string that describes what is loading.
   * @default 'Loading…'
   */
  label?: string
}
