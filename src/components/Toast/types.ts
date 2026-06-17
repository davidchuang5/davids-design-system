export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type ToastSize = 'sm' | 'md' | 'lg'

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual intent of the toast. */
  variant?: ToastVariant

  /** Content size of the toast. */
  size?: ToastSize

  /** Primary message text shown in the toast body. */
  message: string

  /** Optional secondary description rendered below the message. */
  description?: string

  /** Title shown above the message. When omitted the variant label is used. */
  title?: string

  /**
   * Auto-dismiss delay in milliseconds.
   * Pass `null` or `0` to disable auto-dismiss.
   * Defaults to 5000 ms.
   */
  duration?: number | null

  /** Whether the close (×) button is rendered. Defaults to true. */
  closable?: boolean

  /** Called when the toast is dismissed (auto or manual). */
  onClose?: () => void

  /** Whether the toast is currently visible. */
  open?: boolean
}

export interface ToastContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Where on the viewport the toast stack is anchored. */
  position?: ToastPosition
}
