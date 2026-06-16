import styles from './Dropdown.module.css'
import React, { useRef, useEffect, useState } from 'react'

export interface DropdownItem {
  id: string
  label: string
  disabled?: boolean
}

export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: DropdownItem[]
  value?: string
  onChange?: (itemId: string) => void
  triggerLabel: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      items,
      value,
      onChange,
      triggerLabel,
      size = 'md',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLUListElement>(null)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    // Reset highlighted index when dropdown opens
    useEffect(() => {
      if (isOpen) {
        setHighlightedIndex(-1)      }
    }, [isOpen])

    const handleTriggerClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen)
      }
    }

    const handleItemClick = (itemId: string, itemDisabled?: boolean) => {
      if (!itemDisabled) {
        onChange?.(itemId)
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
      const enabledItems = items.filter((item) => !item.disabled)

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setHighlightedIndex((prev) =>
            prev < enabledItems.length - 1 ? prev + 1 : 0
          )
          break

        case 'ArrowUp':
          event.preventDefault()
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : enabledItems.length - 1
          )
          break

        case 'Enter':
        case ' ':
          event.preventDefault()
          if (highlightedIndex >= 0 && enabledItems[highlightedIndex]) {
            handleItemClick(enabledItems[highlightedIndex].id)
          }
          break

        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          triggerRef.current?.focus()
          break

        default:
          break
      }
    }

    const handleTriggerKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement>
    ) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setIsOpen(!isOpen)
      } else if (event.key === 'ArrowDown' && !isOpen) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    const selectedItem = items.find((item) => item.id === value)
    const displayLabel = selectedItem?.label || triggerLabel

    return (
      <div
        ref={ref}
        className={`${styles.dropdown} ${styles[`size-${size}`]} ${
          isOpen ? styles.open : ''
        } ${disabled ? styles.disabled : ''}`}
        {...props}
      >
        <button
          ref={triggerRef}
          className={styles.trigger}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`${triggerLabel}, dropdown menu`}
          disabled={disabled}
          type="button"
        >
          <span className={styles.triggerLabel}>{displayLabel}</span>
          <svg
            className={styles.triggerIcon}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <ul
            ref={menuRef}
            className={styles.menu}
            role="listbox"
            aria-label={triggerLabel}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {items.map((item, index) => {
              const enabledItems = items.filter((i) => !i.disabled)
              const enabledIndex = enabledItems.findIndex((i) => i.id === item.id)
              const isHighlighted = enabledIndex === highlightedIndex

              return (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={value === item.id}
                  className={`${styles.menuItem} ${
                    value === item.id ? styles.selected : ''
                  } ${isHighlighted ? styles.highlighted : ''} ${
                    item.disabled ? styles.itemDisabled : ''
                  }`}
                  onClick={() => handleItemClick(item.id, item.disabled)}
                  onMouseEnter={() => {
                    if (!item.disabled) {
                      setHighlightedIndex(enabledIndex)
                    }
                  }}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                >
                  {item.label}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }
)

Dropdown.displayName = 'Dropdown'

export { Dropdown }
export default Dropdown
