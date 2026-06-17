import React from 'react'

// ---------------------------------------------------------------------------
// Shared size type used across Card and its sub-components
// ---------------------------------------------------------------------------
export type CardSize = 'sm' | 'md' | 'lg'

// ---------------------------------------------------------------------------
// Elevation controls the box-shadow depth of the card surface
// ---------------------------------------------------------------------------
export type CardElevation = 'flat' | 'raised' | 'floating'

// ---------------------------------------------------------------------------
// Root Card props
// ---------------------------------------------------------------------------
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual depth of the card.
   * flat    → no shadow, border only
   * raised  → subtle shadow (default)
   * floating → prominent shadow
   */
  elevation?: CardElevation

  /**
   * Controls internal padding scale across the card sections.
   */
  size?: CardSize

  /**
   * Renders the card with a padded variant — extra horizontal/vertical
   * breathing room, useful for content-heavy layouts.
   */
  padded?: boolean

  /**
   * Makes the entire card interactive (pointer cursor, hover + focus ring).
   * Automatically sets role="button" and tabIndex when true unless the
   * consumer overrides them.
   */
  clickable?: boolean

  /**
   * Adds a hover highlight even when the card is not fully clickable — e.g.
   * cards whose inner CTA is the real action but the whole card should
   * visually respond to hover.
   */
  hoverable?: boolean

  /**
   * Accessible label required when `clickable` is true and the card has no
   * visible heading child — passed to aria-label.
   */
  'aria-label'?: string
}

// ---------------------------------------------------------------------------
// Sub-component props
// ---------------------------------------------------------------------------
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize
}
