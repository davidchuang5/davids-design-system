import React from 'react'

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left'

export type TooltipSize = 'sm' | 'md' | 'lg'

export interface TooltipProps {
  /**
   * The tooltip content / label.
   */
  content: React.ReactNode

  /**
   * The element that triggers the tooltip. Must be a single React element
   * that can receive focus and mouse events.
   */
  children: React.ReactElement

  /**
   * Preferred placement of the tooltip relative to the trigger.
   * @default 'top'
   */
  placement?: TooltipPlacement

  /**
   * Controls the visible state externally (controlled mode).
   * When provided, the component does not manage its own open state.
   */
  open?: boolean

  /**
   * Default open state for uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean

  /**
   * Called when the tooltip requests an open-state change.
   */
  onOpenChange?: (open: boolean) => void

  /**
   * Delay in milliseconds before the tooltip appears on hover/focus.
   * @default 300
   */
  showDelay?: number

  /**
   * Delay in milliseconds before the tooltip hides.
   * @default 100
   */
  hideDelay?: number

  /**
   * Gap in pixels between the tooltip and the trigger element.
   * @default 8
   */
  offset?: number

  /**
   * Size variant affecting padding and font size.
   * @default 'md'
   */
  size?: TooltipSize

  /**
   * When true, the tooltip is never shown.
   * @default false
   */
  disabled?: boolean

  /**
   * An accessible id for the tooltip element. Auto-generated when omitted.
   */
  id?: string
}
