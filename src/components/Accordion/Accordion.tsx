import React from 'react'
import styles from './Accordion.module.css'
import type {
  AccordionProps,
  AccordionItemProps,
} from './types'

// ---------------------------------------------------------------------------
// ChevronIcon — self-contained SVG so the component has zero icon-lib deps
// ---------------------------------------------------------------------------

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ---------------------------------------------------------------------------
// AccordionItemPanel — renders a single header + collapsible content panel
// ---------------------------------------------------------------------------

const AccordionItemPanel: React.FC<AccordionItemProps> = ({
  item,
  isExpanded,
  onToggle,
  variant,
  size,
  index,
  setSize,
}) => {
  const triggerId = `accordion-trigger-${item.id}`
  const panelId  = `accordion-panel-${item.id}`

  const itemClasses = [
    styles.item,
    styles[`item--${variant}`],
    item.disabled ? styles['item--disabled'] : '',
  ]
    .filter(Boolean)
    .join(' ')

  const triggerClasses = [
    styles.trigger,
    styles[`trigger--${size}`],
  ]
    .filter(Boolean)
    .join(' ')

  const panelClasses = [
    styles.panel,
    isExpanded ? styles['panel--open'] : '',
  ]
    .filter(Boolean)
    .join(' ')

  const contentClasses = [
    styles.content,
    styles[`content--${size}`],
  ]
    .filter(Boolean)
    .join(' ')

  const chevronClasses = [
    styles.chevron,
    isExpanded ? styles['chevron--open'] : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!item.disabled) onToggle(item.id)
    }
  }

  return (
    <div className={itemClasses}>
      {/* Trigger */}
      <button
        id={triggerId}
        type="button"
        role="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        aria-disabled={item.disabled}
        aria-posinset={index + 1}
        aria-setsize={setSize}
        className={triggerClasses}
        disabled={item.disabled}
        onClick={() => !item.disabled && onToggle(item.id)}
        onKeyDown={handleKeyDown}
      >
        <span>{item.header}</span>
        <ChevronIcon className={chevronClasses} />
      </button>

      {/* Animated panel */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isExpanded}
        className={panelClasses}
      >
        <div className={styles.panelInner}>
          <div className={contentClasses}>{item.content}</div>
        </div>
      </div>
    </div>
  )
}

AccordionItemPanel.displayName = 'AccordionItemPanel'

// ---------------------------------------------------------------------------
// Accordion — main component
// ---------------------------------------------------------------------------

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      selectionMode = 'single',
      defaultExpandedIds = [],
      expandedIds: controlledExpandedIds,
      onExpandedChange,
      variant = 'default',
      size = 'md',
      collapsible = false,
      className,
      ...rest
    },
    ref,
  ) => {
    // -----------------------------------------------------------------------
    // State — uncontrolled fallback
    // -----------------------------------------------------------------------
    const [internalExpandedIds, setInternalExpandedIds] = React.useState<
      string[]
    >(() => {
      if (selectionMode === 'single') {
        return defaultExpandedIds.length > 0 ? [defaultExpandedIds[0]] : []
      }
      return defaultExpandedIds
    })

    const isControlled = controlledExpandedIds !== undefined
    const expandedIds = isControlled ? controlledExpandedIds : internalExpandedIds

    // -----------------------------------------------------------------------
    // Toggle handler
    // -----------------------------------------------------------------------
    const handleToggle = React.useCallback(
      (id: string) => {
        let next: string[]

        if (selectionMode === 'single') {
          const isCurrentlyOpen = expandedIds.includes(id)
          if (isCurrentlyOpen) {
            // In single mode, only collapse if collapsible is true
            next = collapsible ? [] : expandedIds
          } else {
            next = [id]
          }
        } else {
          // multiple mode — toggle the id in/out of the set
          next = expandedIds.includes(id)
            ? expandedIds.filter((eid) => eid !== id)
            : [...expandedIds, id]
        }

        if (!isControlled) {
          setInternalExpandedIds(next)
        }

        onExpandedChange?.(next)
      },
      [selectionMode, expandedIds, collapsible, isControlled, onExpandedChange],
    )

    // -----------------------------------------------------------------------
    // Keyboard navigation — Up/Down arrows move focus between triggers
    // -----------------------------------------------------------------------
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const triggers = Array.from<HTMLButtonElement>(
        e.currentTarget.querySelectorAll<HTMLButtonElement>(
          'button[aria-expanded]',
        ),
      )
      const focused = document.activeElement as HTMLButtonElement | null
      const currentIndex = focused ? triggers.indexOf(focused) : -1

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = triggers[(currentIndex + 1) % triggers.length]
        next?.focus()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev =
          triggers[(currentIndex - 1 + triggers.length) % triggers.length]
        prev?.focus()
      } else if (e.key === 'Home') {
        e.preventDefault()
        triggers[0]?.focus()
      } else if (e.key === 'End') {
        e.preventDefault()
        triggers[triggers.length - 1]?.focus()
      }
    }

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    const rootClasses = [styles.accordion, className].filter(Boolean).join(' ')

    return (
      <div
        ref={ref}
        role="list"
        className={rootClasses}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {items.map((item, index) => (
          <AccordionItemPanel
            key={item.id}
            item={item}
            isExpanded={expandedIds.includes(item.id)}
            onToggle={handleToggle}
            variant={variant}
            size={size}
            index={index}
            setSize={items.length}
          />
        ))}
      </div>
    )
  },
)

Accordion.displayName = 'Accordion'

export { Accordion }
export default Accordion
