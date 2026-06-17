import React from 'react'

// ---------------------------------------------------------------------------
// Primitive types
// ---------------------------------------------------------------------------

export type TextareaSize = 'sm' | 'md' | 'lg'
export type TextareaVariant = 'default' | 'filled' | 'ghost'
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

// ---------------------------------------------------------------------------
// Props interface
// ---------------------------------------------------------------------------

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * Visual style of the textarea.
   * - default  : outlined border on a raised surface
   * - filled   : sunken/inset surface, no visible border until focus
   * - ghost    : transparent; border and background only appear on hover/focus
   */
  variant?: TextareaVariant

  /** Controls padding and font-size. */
  size?: TextareaSize

  /** Visible label rendered above the textarea. */
  label?: string

  /**
   * id forwarded to the <textarea>; auto-generated when omitted so the
   * label and textarea are always linked via htmlFor / aria-labelledby.
   */
  id?: string

  /** Helper text shown below the textarea in a neutral tone. */
  helperText?: string

  /**
   * When provided, the textarea enters an error state and this message
   * replaces helperText visually. Wired to aria-describedby automatically.
   */
  errorText?: string

  /** Marks the field as required and appends an asterisk to the label. */
  required?: boolean

  /** Visually fills the full width of its container. */
  fullWidth?: boolean

  /**
   * When true, a live character counter is rendered below the textarea.
   * Requires maxLength to be set for a "used / max" display; when maxLength
   * is absent it shows the raw count.
   */
  showCharacterCount?: boolean

  /**
   * Controls which resize handle(s) the browser renders.
   * Defaults to 'vertical' so layouts are not broken by horizontal growth.
   */
  resize?: TextareaResize

  /** Number of visible text rows. Forwarded directly to the <textarea>. */
  rows?: number
}
