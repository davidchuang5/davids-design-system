import React from 'react'
import styles from './Pagination.module.css'
import type { PaginationProps, PageItem } from './types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build the ordered list of page items (page numbers + ellipsis sentinels)
 * that should be rendered between the Prev and Next controls.
 *
 * Algorithm:
 *  - Always show page 1 and page totalPages.
 *  - Show `siblingCount` pages centered around currentPage.
 *  - Insert an ellipsis wherever there is a gap > 1 between shown pages.
 */
function buildPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] {
  // When the total page count fits within the visible window, show everything.
  if (totalPages <= siblingCount) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: 'page' as const,
      page: i + 1,
    }))
  }

  // Number of pages flanking the current page on each side.
  const delta = Math.floor((siblingCount - 3) / 2) // reserve 3 slots: first, last, current

  const rangeStart = Math.max(2, currentPage - delta)
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

  const items: PageItem[] = []

  // First page is always shown.
  items.push({ type: 'page', page: 1 })

  // Left ellipsis — only when there is a gap after page 1.
  if (rangeStart > 2) {
    items.push({ type: 'ellipsis', key: 'ellipsis-left' })
  }

  // Middle range.
  for (let p = rangeStart; p <= rangeEnd; p++) {
    items.push({ type: 'page', page: p })
  }

  // Right ellipsis — only when there is a gap before the last page.
  if (rangeEnd < totalPages - 1) {
    items.push({ type: 'ellipsis', key: 'ellipsis-right' })
  }

  // Last page is always shown (guard against totalPages === 1 which is handled above).
  if (totalPages > 1) {
    items.push({ type: 'page', page: totalPages })
  }

  return items
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  size: 'sm' | 'md' | 'lg'
  variant: 'default' | 'outline' | 'ghost'
}

const PageButton = React.forwardRef<HTMLButtonElement, PageButtonProps>(
  ({ active, size, variant, children, className, ...props }, ref) => {
    const classes = [
      styles.item,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      active ? styles.active : '',
      props.disabled ? styles.disabled : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button ref={ref} type="button" className={classes} {...props}>
        {children}
      </button>
    )
  },
)
PageButton.displayName = 'Pagination.PageButton'

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      size = 'md',
      variant = 'default',
      siblingCount = 7,
      disabled = false,
      'aria-label': ariaLabel = 'Pagination',
      className,
      ...rest
    },
    ref,
  ) => {
    const clampedCurrent = Math.max(1, Math.min(currentPage, totalPages))

    const handleChange = (page: number) => {
      if (disabled) return
      if (page < 1 || page > totalPages) return
      if (page === clampedCurrent) return
      onPageChange(page)
    }

    const handleKeyDown =
      (page: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleChange(page)
        }
      }

    const pageItems = buildPageItems(clampedCurrent, totalPages, Math.max(5, siblingCount))

    const isPrevDisabled = disabled || clampedCurrent <= 1
    const isNextDisabled = disabled || clampedCurrent >= totalPages

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label={ariaLabel}
        className={[styles.root, className ?? ''].filter(Boolean).join(' ')}
        {...rest}
      >
        <ol className={styles.list}>
          {/* ---- Previous ---- */}
          <li>
            <PageButton
              size={size}
              variant={variant}
              aria-label="Go to previous page"
              disabled={isPrevDisabled}
              onClick={() => handleChange(clampedCurrent - 1)}
              onKeyDown={handleKeyDown(clampedCurrent - 1)}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="10 12 6 8 10 4" />
              </svg>
            </PageButton>
          </li>

          {/* ---- Page items ---- */}
          {pageItems.map((item) => {
            if (item.type === 'ellipsis') {
              return (
                <li key={item.key} aria-hidden="true">
                  <span className={[styles.ellipsis, styles[`size-${size}`]].join(' ')}>
                    &hellip;
                  </span>
                </li>
              )
            }

            const isActive = item.page === clampedCurrent
            return (
              <li key={item.page}>
                <PageButton
                  size={size}
                  variant={variant}
                  active={isActive}
                  disabled={disabled}
                  aria-label={`Page ${item.page}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleChange(item.page)}
                  onKeyDown={handleKeyDown(item.page)}
                >
                  {item.page}
                </PageButton>
              </li>
            )
          })}

          {/* ---- Next ---- */}
          <li>
            <PageButton
              size={size}
              variant={variant}
              aria-label="Go to next page"
              disabled={isNextDisabled}
              onClick={() => handleChange(clampedCurrent + 1)}
              onKeyDown={handleKeyDown(clampedCurrent + 1)}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 4 10 8 6 12" />
              </svg>
            </PageButton>
          </li>
        </ol>
      </nav>
    )
  },
)

Pagination.displayName = 'Pagination'

export { Pagination }
export default Pagination
