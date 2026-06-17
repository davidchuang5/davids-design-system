import React from 'react'

/** Semantic variant controls colour, icon defaults, and ARIA live region urgency. */
export type BannerVariant = 'info' | 'success' | 'warning' | 'error'

/** Visual density / prominence of the banner. */
export type BannerSize = 'sm' | 'md' | 'lg'

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Semantic intent of the message.
   * @default 'info'
   */
  variant?: BannerVariant

  /**
   * Controls internal padding and font size.
   * @default 'md'
   */
  size?: BannerSize

  /**
   * Short, bold heading rendered above the message body.
   * Omit to render a single-line banner with body text only.
   */
  title?: React.ReactNode

  /**
   * Slot for a leading icon element.
   * Pass `null` to suppress the default variant icon.
   * @default — each variant renders a built-in SVG icon
   */
  icon?: React.ReactNode | null

  /**
   * Slot for one or more action controls (e.g. a Button or link).
   * Rendered below the body text, right-aligned.
   */
  action?: React.ReactNode

  /**
   * When true the banner renders a dismiss (×) button in the trailing corner.
   * @default false
   */
  dismissible?: boolean

  /**
   * Called when the user activates the dismiss button.
   * Consumers are responsible for unmounting / hiding the banner.
   */
  onDismiss?: () => void

  /**
   * Accessible label for the dismiss button.
   * @default 'Dismiss'
   */
  dismissLabel?: string

  /**
   * aria-live politeness setting forwarded to the banner root.
   * Defaults to 'assertive' for error/warning and 'polite' for info/success.
   * Override when you need full control.
   */
  live?: 'polite' | 'assertive' | 'off'
}
