import React from 'react'

// ---------------------------------------------------------------------------
// DropdownItem — a single selectable option in the menu
// ---------------------------------------------------------------------------
export interface DropdownItem {
  /** Unique identifier for the item */
  id: string
  /** Display label */
  label: string
  /** Optional icon rendered before the label */
  icon?: React.ReactNode
  /** When true the item is shown but cannot be interacted with */
  disabled?: boolean
  /** Marks this item as a non-interactive section divider */
  divider?: boolean
}

// ---------------------------------------------------------------------------
// DropdownProps — top-level component props
// ---------------------------------------------------------------------------
export type DropdownSize = 'sm' | 'md' | 'lg'
export type DropdownVariant = 'default' | 'ghost' | 'outline'
export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface DropdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The trigger element label (used when no custom trigger is provided) */
  label: string
  /** Menu items to render */
  items: DropdownItem[]
  /** Currently selected item id (controlled) */
  selectedId?: string
  /** Default selected item id (uncontrolled) */
  defaultSelectedId?: string
  /** Callback fired when an item is selected */
  onChange?: (item: DropdownItem) => void
  /** Controls open state externally (controlled) */
  open?: boolean
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Visual size of the trigger button and menu items */
  size?: DropdownSize
  /** Visual variant of the trigger button */
  variant?: DropdownVariant
  /** Where the menu opens relative to the trigger */
  placement?: DropdownPlacement
  /** When true, the entire component is non-interactive */
  disabled?: boolean
  /** Optional custom trigger element — receives aria/interaction props via clone */
  trigger?: React.ReactElement
  /** Optional accessible label for the listbox (falls back to `label`) */
  menuLabel?: string
}
