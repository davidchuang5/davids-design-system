export type PaginationSize = 'sm' | 'md' | 'lg'
export type PaginationVariant = 'default' | 'outline' | 'ghost'

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** The currently active page (1-indexed). */
  currentPage: number
  /** Total number of pages. */
  totalPages: number
  /** Called with the new page number when the user navigates. */
  onPageChange: (page: number) => void
  /** Visual size of every page item. @default 'md' */
  size?: PaginationSize
  /** Visual style of page items. @default 'default' */
  variant?: PaginationVariant
  /**
   * Maximum page buttons to show between the prev/next controls.
   * Ellipses are inserted automatically when totalPages exceeds this value.
   * Must be an odd number >= 5 so there is always room for first, last and
   * at least one neighbour on each side of the active page.
   * @default 7
   */
  siblingCount?: number
  /** Disables all controls. */
  disabled?: boolean
  /** Accessible label for the <nav> landmark. @default 'Pagination' */
  'aria-label'?: string
}

/** Resolved page item used internally and exposed for consumers who need to
 *  build a custom renderer on top of the same pagination logic. */
export type PageItem =
  | { type: 'page'; page: number }
  | { type: 'ellipsis'; key: string }
