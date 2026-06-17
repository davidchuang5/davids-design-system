import React, {
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import styles from './Tooltip.module.css'
import type { TooltipPlacement, TooltipProps, TooltipSize } from './types'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function placementClass(placement: TooltipPlacement): string {
  const map: Record<TooltipPlacement, string> = {
    top:    styles['placement-top'],
    bottom: styles['placement-bottom'],
    left:   styles['placement-left'],
    right:  styles['placement-right'],
  }
  return map[placement]
}

function sizeClass(size: TooltipSize): string {
  const map: Record<TooltipSize, string> = {
    sm: styles['size-sm'],
    md: styles['size-md'],
    lg: styles['size-lg'],
  }
  return map[size]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Tooltip — puma-ui
 *
 * Wraps any single focusable / hoverable child element and shows a labelled
 * tooltip bubble.  Supports both controlled (`open` prop) and uncontrolled
 * (internal state + optional `defaultOpen`) modes, configurable placement,
 * show/hide delays, and three size variants.
 *
 * Accessibility
 * - The trigger element receives `aria-describedby` pointing at the tooltip.
 * - The tooltip element carries `role="tooltip"`.
 * - Keyboard: tooltip appears on focus and is dismissed on Escape or blur.
 */
const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      placement   = 'top',
      open,
      defaultOpen = false,
      onOpenChange,
      showDelay   = 300,
      hideDelay   = 100,
      offset      = 8,
      size        = 'md',
      disabled    = false,
      id,
    },
    ref,
  ) => {
    // -----------------------------------------------------------------------
    // State — controlled vs uncontrolled
    // -----------------------------------------------------------------------
    const isControlled = open !== undefined
    const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen)
    const isVisible = isControlled ? (open as boolean) : internalOpen

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next)
        onOpenChange?.(next)
      },
      [isControlled, onOpenChange],
    )

    // -----------------------------------------------------------------------
    // Timers
    // -----------------------------------------------------------------------
    const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const scheduleShow = useCallback(() => {
      if (disabled) return
      if (hideTimer.current) clearTimeout(hideTimer.current)
      showTimer.current = setTimeout(() => setOpen(true), showDelay)
    }, [disabled, showDelay, setOpen])

    const scheduleHide = useCallback(() => {
      if (showTimer.current) clearTimeout(showTimer.current)
      hideTimer.current = setTimeout(() => setOpen(false), hideDelay)
    }, [hideDelay, setOpen])

    const cancelTimers = useCallback(() => {
      if (showTimer.current) clearTimeout(showTimer.current)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }, [])

    // Dismiss immediately on Escape
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          cancelTimers()
          setOpen(false)
        }
      },
      [cancelTimers, setOpen],
    )

    // Clean up timers on unmount
    useEffect(() => () => cancelTimers(), [cancelTimers])

    // -----------------------------------------------------------------------
    // IDs for aria-describedby
    // -----------------------------------------------------------------------
    const generatedId = useId()
    const tooltipId = id ?? `tooltip-${generatedId}`

    // -----------------------------------------------------------------------
    // Inject event handlers + aria attribute into the trigger child
    // -----------------------------------------------------------------------
    const trigger = cloneElement(children, {
      'aria-describedby': isVisible && !disabled ? tooltipId : undefined,
      onMouseEnter: (e: React.MouseEvent) => {
        scheduleShow()
        children.props.onMouseEnter?.(e)
      },
      onMouseLeave: (e: React.MouseEvent) => {
        scheduleHide()
        children.props.onMouseLeave?.(e)
      },
      onFocus: (e: React.FocusEvent) => {
        scheduleShow()
        children.props.onFocus?.(e)
      },
      onBlur: (e: React.FocusEvent) => {
        scheduleHide()
        children.props.onBlur?.(e)
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        handleKeyDown(e)
        children.props.onKeyDown?.(e)
      },
    })

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    return (
      <div
        ref={ref}
        className={styles.wrapper}
        // Expose the offset value as a CSS custom property so the stylesheet
        // can consume it without needing JS-computed inline styles.
        style={{ '--ds-tooltip-offset': `${offset}px` } as React.CSSProperties}
      >
        {trigger}

        <div
          id={tooltipId}
          role="tooltip"
          aria-hidden={!isVisible || disabled}
          data-visible={isVisible && !disabled ? 'true' : 'false'}
          data-placement={placement}
          data-size={size}
          className={[
            styles.tooltip,
            placementClass(placement),
            sizeClass(size),
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {content}
          <span className={styles.arrow} aria-hidden="true" />
        </div>
      </div>
    )
  },
)

Tooltip.displayName = 'Tooltip'

export { Tooltip }
export default Tooltip
export type { TooltipPlacement, TooltipProps, TooltipSize }
