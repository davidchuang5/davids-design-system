import React from 'react'

// ---------------------------------------------------------------------------
// Size
// ---------------------------------------------------------------------------
export type ModalSize = 'sm' | 'md' | 'lg'

// ---------------------------------------------------------------------------
// Core Modal props
// ---------------------------------------------------------------------------
export interface ModalProps {
  /** Controls open/closed state from the parent */
  open: boolean

  /** Called when the modal requests to be closed (ESC key, backdrop click,
   *  or the built-in close button). The parent is responsible for updating
   *  `open`. */
  onClose: () => void

  /** Width preset for the dialog panel */
  size?: ModalSize

  /**
   * When true the backdrop click will NOT close the modal.
   * Useful for confirmation dialogs that require an explicit action.
   */
  disableBackdropClose?: boolean

  /**
   * When true the ESC key will NOT close the modal.
   */
  disableEscClose?: boolean

  /** Accessible label for the dialog element.
   *  Provide either `aria-label` or `aria-labelledby` — if you pass a
   *  `header` slot the component wires up `aria-labelledby` automatically
   *  using the generated heading id. */
  'aria-label'?: string

  // ---- Slot props ---------------------------------------------------------

  /** Content rendered inside the `.modal-header` region */
  header?: React.ReactNode

  /** Content rendered inside the `.modal-body` region */
  children: React.ReactNode

  /** Content rendered inside the `.modal-footer` region */
  footer?: React.ReactNode

  // ---- HTML div passthrough -----------------------------------------------
  className?: string
  style?: React.CSSProperties
}
