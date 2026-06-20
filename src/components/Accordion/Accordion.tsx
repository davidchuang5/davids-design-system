import React from 'react'
import styles from './Accordion.module.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AccordionSize = 'sm' | 'md' | 'lg'
export type AccordionVariant = 'default' | 'bordered' | 'flush'

export interface AccordionItem {
  /** Unique identifier for this item. Used to wire aria-controls / aria-labelledby. */
  id: string
  /** Text or node rendered inside the trigger button. */
  trigger: React.ReactNode
  /** Content revealed when the item is expanded. */
  content: React.ReactNode
  /** Prevent this individual item from being opened or closed. */
  disabled?: boolean
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The accordion items to render. */
  items: AccordionItem[]
  /**
   * Visual variant.
   * - `default`  — each item is a raised card with a bottom gap.
   * - `bordered` — items share a single outlined container, separated by dividers.
   * - `flush`    — no borders or card surfaces; only a bottom divider per item.
   */
  variant?: AccordionVariant
  /** Size controls padding and font-size of the trigger and content panels. */
  size?: AccordionSize
  /**
   * When `true`, multiple items may be open simultaneously.
   * When `false` (default), opening one item closes any other open item.
   */
  allowMultiple?: boolean
  /** IDs of items that should be open by default (uncontrolled). */
  defaultOpenIds?: string[]
  /**
   * Controlled open IDs. When provided, the component becomes fully
   * controlled and `onOpenChange` must be used to update the value.
   */
  openIds?: string[]
  /** Callback fired whenever the set of open item IDs changes. */
  onOpenChange?: (openIds: string[]) => void
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTriggerId(itemId: string): string {
  return `accordion-trigger-${itemId}`
}

function makePanelId(itemId: string): string {
  return `accordion-panel-${itemId}`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Accordion — puma-ui design system
 *
 * Renders a list of collapsible disclosure sections that follow the
 * WAI-ARIA Accordion pattern (https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).
 *
 * Keyboard interaction
 * - Enter / Space   toggle the focused trigger
 * - ArrowDown       move focus to the next trigger
 * - ArrowUp         move focus to the previous trigger
 * - Home            move focus to the first trigger
 * - End             move focus to the last trigger
 *
 * @example
 * <Accordion
 *   variant="bordered"
 *   size="md"
 *   items={[
 *     { id: 'q1', trigger: 'What is puma-ui?', content: 'A warm-neutral design system.' },
 *   ]}
 * />
 */
const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      variant = 'default',
      size = 'md',
      allowMultiple = false,
      defaultOpenIds = [],
      openIds: controlledOpenIds,
      onOpenChange,
      className,
      ...rest
    },
    ref,
  ) => {
    // ------------------------------------------------------------------
    // State — uncontrolled path
    // ------------------------------------------------------------------
    const [internalOpenIds, setInternalOpenIds] = React.useState<string[]>(
      () => defaultOpenIds,
    )

    const isControlled = controlledOpenIds !== undefined
    const openIds = isControlled ? controlledOpenIds : internalOpenIds

    // ------------------------------------------------------------------
    // Toggle logic
    // ------------------------------------------------------------------
    const toggle = React.useCallback(
      (id: string) => {
        const isOpen = openIds.includes(id)

        let next: string[]
        if (isOpen) {
          // Always allow closing
          next = openIds.filter((oid) => oid !== id)
        } else if (allowMultiple) {
          next = [...openIds, id]
        } else {
          // Single-open: replace the current open set
          next = [id]
        }

        if (!isControlled) {
          setInternalOpenIds(next)
        }
        onOpenChange?.(next)
      },
      [openIds, allowMultiple, isControlled, onOpenChange],
    )

    // ------------------------------------------------------------------
    // Keyboard navigation
    // ------------------------------------------------------------------
    const triggerRefs = React.useRef<Array<HTMLButtonElement | null>>([])

    const handleTriggerKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        const enabledRefs = triggerRefs.current.filter(Boolean) as HTMLButtonElement[]
        const enabledIndices = items
          .map((item, i) => (item.disabled ? null : i))
          .filter((i): i is number => i !== null)

        const currentEnabledPos = enabledIndices.indexOf(index)

        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault()
            const nextPos = (currentEnabledPos + 1) % enabledIndices.length
            triggerRefs.current[enabledIndices[nextPos]]?.focus()
            break
          }
          case 'ArrowUp': {
            e.preventDefault()
            const prevPos =
              (currentEnabledPos - 1 + enabledIndices.length) % enabledIndices.length
            triggerRefs.current[enabledIndices[prevPos]]?.focus()
            break
          }
          case 'Home': {
            e.preventDefault()
            triggerRefs.current[enabledIndices[0]]?.focus()
            break
          }
          case 'End': {
            e.preventDefault()
            triggerRefs.current[enabledIndices[enabledIndices.length - 1]]?.focus()
            break
          }
          default:
            break
        }
      },
      [items],
    )

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    const rootClass = [
      styles.accordion,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={rootClass} {...rest}>
        {items.map((item, index) => {
          const isOpen = openIds.includes(item.id)
          const triggerId = makeTriggerId(item.id)
          const panelId = makePanelId(item.id)

          return (
            <div
              key={item.id}
              className={[
                styles.item,
                isOpen ? styles.itemOpen : '',
                item.disabled ? styles.itemDisabled : '',
              ]
                .filter(Boolean)
                .join(' ')}
              data-state={isOpen ? 'open' : 'closed'}
            >
              {/* Heading wraps the trigger per the ARIA pattern */}
              <h3 className={styles.heading}>
                <button
                  id={triggerId}
                  ref={(el) => {
                    triggerRefs.current[index] = el
                  }}
                  type="button"
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-disabled={item.disabled || undefined}
                  disabled={item.disabled}
                  onClick={() => !item.disabled && toggle(item.id)}
                  onKeyDown={(e) => handleTriggerKeyDown(e, index)}
                >
                  <span className={styles.triggerLabel}>{item.trigger}</span>
                  {/* Chevron icon — CSS-only, rotates on open */}
                  <span className={styles.chevron} aria-hidden="true" />
                </button>
              </h3>

              {/* Content panel */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={styles.panel}
                hidden={!isOpen}
              >
                <div className={styles.panelInner}>{item.content}</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  },
)

Accordion.displayName = 'Accordion'

export { Accordion }
export default Accordion
