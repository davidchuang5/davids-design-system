import React from 'react'

// ---------------------------------------------------------------------------
// AccordionItem — data shape for a single panel
// ---------------------------------------------------------------------------

export interface AccordionItem {
  /** Unique identifier for the item — used to track expanded state */
  id: string
  /** Content rendered inside the trigger button */
  header: React.ReactNode
  /** Content revealed when the panel is open */
  content: React.ReactNode
  /** When true the item cannot be expanded or collapsed */
  disabled?: boolean
}

// ---------------------------------------------------------------------------
// Accordion component props
// ---------------------------------------------------------------------------

export type AccordionSelectionMode = 'single' | 'multiple'

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** List of panels to render */
  items: AccordionItem[]
  /**
   * Controls whether one or many items can be open at the same time.
   * @default 'single'
   */
  selectionMode?: AccordionSelectionMode
  /**
   * IDs of the items that should be expanded on first render.
   * For `selectionMode="single"` only the first ID in the array is used.
   */
  defaultExpandedIds?: string[]
  /**
   * Controlled set of expanded item IDs.
   * When provided you must also supply `onExpandedChange`.
   */
  expandedIds?: string[]
  /** Called whenever the expanded set changes */
  onExpandedChange?: (expandedIds: string[]) => void
  /**
   * Visual / density variant.
   * @default 'default'
   */
  variant?: 'default' | 'bordered' | 'ghost'
  /**
   * Size controls padding and font size inside each panel.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * When true the first open item will not be closed when another is opened
   * (only meaningful in `selectionMode="single"`).
   * @default false
   */
  collapsible?: boolean
}

// ---------------------------------------------------------------------------
// Internal sub-component props (not part of the public API surface but
// exported so advanced consumers can build custom wrappers)
// ---------------------------------------------------------------------------

export interface AccordionItemProps {
  item: AccordionItem
  isExpanded: boolean
  onToggle: (id: string) => void
  variant: NonNullable<AccordionProps['variant']>
  size: NonNullable<AccordionProps['size']>
  /** Zero-based position within the list — used for a11y `aria-setsize` */
  index: number
  /** Total number of items — used for a11y `aria-setsize` */
  setSize: number
}
