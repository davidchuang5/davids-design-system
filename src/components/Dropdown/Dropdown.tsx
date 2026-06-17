import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import styles from './Dropdown.module.css'
import type {
  DropdownItem,
  DropdownPlacement,
  DropdownProps,
  DropdownSize,
  DropdownVariant,
} from './types'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function triggerSizeClass(size: DropdownSize): string {
  return (
    { sm: styles.triggerSm, md: styles.triggerMd, lg: styles.triggerLg }[size]
  )
}

function triggerVariantClass(variant: DropdownVariant): string {
  return (
    {
      default: styles.triggerDefault,
      outline: styles.triggerOutline,
      ghost: styles.triggerGhost,
    }[variant]
  )
}

function itemSizeClass(size: DropdownSize): string {
  return (
    { sm: styles.itemSm, md: styles.itemMd, lg: styles.itemLg }[size]
  )
}

function menuPlacementClass(placement: DropdownPlacement): string {
  return (
    {
      'bottom-start': styles.menuBottomStart,
      'bottom-end': styles.menuBottomEnd,
      'top-start': styles.menuTopStart,
      'top-end': styles.menuTopEnd,
    }[placement]
  )
}

// Chevron SVG — inline so consumers have no extra asset dependency
const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Checkmark SVG — rendered next to selected item
const Checkmark: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    focusable="false"
    style={{ marginLeft: 'auto', flexShrink: 0 }}
  >
    <path
      d="M2.5 7l3.5 3.5 5.5-7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      items,
      selectedId: controlledSelectedId,
      defaultSelectedId,
      onChange,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      size = 'md',
      variant = 'default',
      placement = 'bottom-start',
      disabled = false,
      trigger: customTrigger,
      menuLabel,
      className,
      ...divProps
    },
    ref,
  ) => {
    // -----------------------------------------------------------------------
    // State — open / selectedId (support both controlled & uncontrolled)
    // -----------------------------------------------------------------------
    const isOpenControlled = controlledOpen !== undefined
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const open = isOpenControlled ? controlledOpen! : internalOpen

    const isSelectedControlled = controlledSelectedId !== undefined
    const [internalSelectedId, setInternalSelectedId] = useState<
      string | undefined
    >(defaultSelectedId)
    const selectedId = isSelectedControlled
      ? controlledSelectedId
      : internalSelectedId

    // -----------------------------------------------------------------------
    // Refs
    // -----------------------------------------------------------------------
    const rootRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLUListElement>(null)
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
    const [focusedIndex, setFocusedIndex] = useState<number>(-1)

    // Merge forwarded ref with internal rootRef
    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        ;(rootRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref],
    )

    // -----------------------------------------------------------------------
    // IDs for WAI-ARIA
    // -----------------------------------------------------------------------
    const uid = useId()
    const triggerId = `ds-dropdown-trigger-${uid}`
    const menuId = `ds-dropdown-menu-${uid}`

    // -----------------------------------------------------------------------
    // Derived data — flatten out dividers for keyboard navigation
    // -----------------------------------------------------------------------
    const navigableItems = items.filter((i) => !i.divider && !i.disabled)

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------
    const setOpen = useCallback(
      (next: boolean) => {
        if (!isOpenControlled) setInternalOpen(next)
        onOpenChange?.(next)
      },
      [isOpenControlled, onOpenChange],
    )

    const selectItem = useCallback(
      (item: DropdownItem) => {
        if (!isSelectedControlled) setInternalSelectedId(item.id)
        onChange?.(item)
        setOpen(false)
        // Return focus to trigger after selection
        setTimeout(() => triggerRef.current?.focus(), 0)
      },
      [isSelectedControlled, onChange, setOpen],
    )

    const close = useCallback(() => {
      setOpen(false)
      setFocusedIndex(-1)
      setTimeout(() => triggerRef.current?.focus(), 0)
    }, [setOpen])

    // -----------------------------------------------------------------------
    // Keyboard handling — trigger
    // -----------------------------------------------------------------------
    const handleTriggerKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
          case 'ArrowDown': {
            e.preventDefault()
            setOpen(true)
            // Focus first item after paint
            setTimeout(() => {
              const firstIndex = items.findIndex(
                (i) => !i.divider && !i.disabled,
              )
              setFocusedIndex(firstIndex)
              itemRefs.current[firstIndex]?.focus()
            }, 0)
            break
          }
          case 'ArrowUp': {
            e.preventDefault()
            setOpen(true)
            // Focus last item after paint
            setTimeout(() => {
              const lastIndex = [...items]
                .reverse()
                .findIndex((i) => !i.divider && !i.disabled)
              const realIndex = items.length - 1 - lastIndex
              setFocusedIndex(realIndex)
              itemRefs.current[realIndex]?.focus()
            }, 0)
            break
          }
          case 'Escape': {
            close()
            break
          }
        }
      },
      [items, setOpen, close],
    )

    // -----------------------------------------------------------------------
    // Keyboard handling — menu items
    // -----------------------------------------------------------------------
    const handleItemKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>, itemIndex: number) => {
        const navigableIndices = items
          .map((item, i) => ({ item, i }))
          .filter(({ item }) => !item.divider && !item.disabled)
          .map(({ i }) => i)

        const posInNavigable = navigableIndices.indexOf(itemIndex)

        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault()
            const nextPos = Math.min(
              posInNavigable + 1,
              navigableIndices.length - 1,
            )
            const nextIndex = navigableIndices[nextPos]
            setFocusedIndex(nextIndex)
            itemRefs.current[nextIndex]?.focus()
            break
          }
          case 'ArrowUp': {
            e.preventDefault()
            const prevPos = Math.max(posInNavigable - 1, 0)
            const prevIndex = navigableIndices[prevPos]
            setFocusedIndex(prevIndex)
            itemRefs.current[prevIndex]?.focus()
            break
          }
          case 'Home': {
            e.preventDefault()
            const firstIndex = navigableIndices[0]
            setFocusedIndex(firstIndex)
            itemRefs.current[firstIndex]?.focus()
            break
          }
          case 'End': {
            e.preventDefault()
            const lastIndex = navigableIndices[navigableIndices.length - 1]
            setFocusedIndex(lastIndex)
            itemRefs.current[lastIndex]?.focus()
            break
          }
          case 'Escape':
          case 'Tab': {
            close()
            break
          }
          case 'Enter':
          case ' ': {
            e.preventDefault()
            const targetItem = items[itemIndex]
            if (targetItem && !targetItem.divider && !targetItem.disabled) {
              selectItem(targetItem)
            }
            break
          }
        }
      },
      [items, close, selectItem],
    )

    // -----------------------------------------------------------------------
    // Click-outside to close
    // -----------------------------------------------------------------------
    useEffect(() => {
      if (!open) return

      const handlePointerDown = (e: PointerEvent) => {
        if (
          rootRef.current &&
          !rootRef.current.contains(e.target as Node)
        ) {
          close()
        }
      }

      document.addEventListener('pointerdown', handlePointerDown)
      return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [open, close])

    // -----------------------------------------------------------------------
    // Render helpers
    // -----------------------------------------------------------------------
    const selectedItem = items.find((i) => i.id === selectedId)
    const triggerLabel = selectedItem?.label ?? label

    const triggerClasses = [
      styles.trigger,
      triggerSizeClass(size),
      triggerVariantClass(variant),
      disabled ? styles.triggerDisabled : '',
    ]
      .filter(Boolean)
      .join(' ')

    const defaultTrigger = (
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        className={triggerClasses}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
      >
        {triggerLabel}
        <ChevronDown
          className={[styles.chevron, open ? styles.chevronOpen : '']
            .filter(Boolean)
            .join(' ')}
        />
      </button>
    )

    // If a custom trigger is provided, clone it with the necessary aria props
    const triggerElement = customTrigger
      ? React.cloneElement(customTrigger, {
          id: triggerId,
          ref: triggerRef,
          'aria-haspopup': 'listbox',
          'aria-expanded': open,
          'aria-controls': menuId,
          disabled,
          onClick: (e: React.MouseEvent) => {
            customTrigger.props.onClick?.(e)
            if (!disabled) setOpen(!open)
          },
          onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
            customTrigger.props.onKeyDown?.(e)
            handleTriggerKeyDown(e)
          },
        })
      : defaultTrigger

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    return (
      <div
        {...divProps}
        ref={mergedRef}
        className={[styles.root, className].filter(Boolean).join(' ')}
      >
        {triggerElement}

        {open && (
          <ul
            ref={menuRef}
            id={menuId}
            role="listbox"
            aria-labelledby={triggerId}
            aria-label={menuLabel ?? label}
            className={[styles.menu, menuPlacementClass(placement)]
              .filter(Boolean)
              .join(' ')}
            tabIndex={-1}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <li key={item.id} role="separator" aria-hidden="true">
                    <hr className={styles.divider} />
                  </li>
                )
              }

              const isSelected = item.id === selectedId
              const isFocused = focusedIndex === index

              const itemClasses = [
                styles.item,
                itemSizeClass(size),
                isSelected ? styles.itemSelected : '',
                isFocused ? styles.itemHovered : '',
                item.disabled ? styles.itemDisabled : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <li key={item.id} role="option" aria-selected={isSelected}>
                  <button
                    ref={(el) => {
                      itemRefs.current[index] = el
                    }}
                    type="button"
                    className={itemClasses}
                    disabled={item.disabled}
                    tabIndex={isFocused ? 0 : -1}
                    onClick={() => selectItem(item)}
                    onKeyDown={(e) => handleItemKeyDown(e, index)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    onMouseLeave={() => setFocusedIndex(-1)}
                    aria-disabled={item.disabled}
                  >
                    {item.icon && (
                      <span className={styles.itemIcon} aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                    {isSelected && <Checkmark />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  },
)

Dropdown.displayName = 'Dropdown'

export { Dropdown }
export default Dropdown
