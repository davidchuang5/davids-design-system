import React, { useState, useRef, useEffect } from 'react'
import styles from './Tooltip.module.css'

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content displayed in the tooltip */
  content: React.ReactNode
  /** Placement of the tooltip relative to children trigger */
  placement?: TooltipPlacement
  /** Whether tooltip is visible */
  isOpen?: boolean
  /** Callback when tooltip open state changes */
  onOpenChange?: (isOpen: boolean) => void
  /** Delay before showing tooltip in ms */
  showDelay?: number
  /** Delay before hiding tooltip in ms */
  hideDelay?: number
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      placement = 'top',
      isOpen: controlledIsOpen,
      onOpenChange,
      showDelay = 0,
      hideDelay = 0,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
    const isOpen =
      controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen
    const triggerRef = useRef<HTMLDivElement>(null)
    const showTimeoutRef = useRef<NodeJS.Timeout>()
    const hideTimeoutRef = useRef<NodeJS.Timeout>()

    const handleOpenChange = (nextIsOpen: boolean) => {
      if (controlledIsOpen === undefined) {
        setUncontrolledIsOpen(nextIsOpen)
      }
      onOpenChange?.(nextIsOpen)
    }

    const handleMouseEnter = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      if (showDelay) {
        showTimeoutRef.current = setTimeout(
          () => handleOpenChange(true),
          showDelay
        )
      } else {
        handleOpenChange(true)
      }
    }

    const handleMouseLeave = () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current)
      }
      if (hideDelay) {
        hideTimeoutRef.current = setTimeout(
          () => handleOpenChange(false),
          hideDelay
        )
      } else {
        handleOpenChange(false)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape' && isOpen) {
        handleOpenChange(false)
      }
    }

    useEffect(() => {
      return () => {
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      }
    }, [])

    return (
      <div
        ref={ref}
        className={styles.tooltipWrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <div
          ref={triggerRef}
          className={styles.tooltipTrigger}
          role="button"
          tabIndex={0}
          aria-describedby={isOpen ? 'tooltip-content' : undefined}
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>

        {isOpen && (
          <div
            id="tooltip-content"
            className={`${styles.tooltipContent} ${styles[`placement-${placement}`]}`}
            role="tooltip"
            aria-hidden={!isOpen}
          >
            <div className={styles.tooltipArrow} />
            {content}
          </div>
        )}
      </div>
    )
  }
)

Tooltip.displayName = 'Tooltip'

export { Tooltip }
export default Tooltip
