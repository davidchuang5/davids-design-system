export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline'

export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual style of the badge.
   * @default 'default'
   */
  variant?: BadgeVariant

  /**
   * Size of the badge.
   * @default 'md'
   */
  size?: BadgeSize

  /**
   * Accessible label override. Use when badge text alone is not descriptive
   * enough for screen-reader users (e.g. a numeric count without context).
   */
  'aria-label'?: string
}
