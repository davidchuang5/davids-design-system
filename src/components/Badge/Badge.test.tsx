import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge } from './Badge'
import styles from './Badge.module.css'
import type { BadgeVariant, BadgeSize } from './types'

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------
describe('Badge — rendering', () => {
  it('renders children as visible text', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders a <span> element', () => {
    render(<Badge>span check</Badge>)
    const el = screen.getByRole('status')
    expect(el.tagName).toBe('SPAN')
  })

  it('renders with no children without throwing', () => {
    render(<Badge />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 2. Ref forwarding
// ---------------------------------------------------------------------------
describe('Badge — ref forwarding', () => {
  it('forwards a ref to the underlying <span>', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<Badge ref={ref}>Ref test</Badge>)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('SPAN')
  })
})

// ---------------------------------------------------------------------------
// 3. ARIA attributes
// ---------------------------------------------------------------------------
describe('Badge — accessibility', () => {
  it('has role="status" by default', () => {
    render(<Badge>Status</Badge>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('accepts a custom role override', () => {
    render(<Badge role="img" aria-label="New">3</Badge>)
    expect(screen.getByRole('img', { name: 'New' })).toBeInTheDocument()
  })

  it('accepts an aria-label prop', () => {
    render(<Badge aria-label="3 new notifications">3</Badge>)
    const el = screen.getByRole('status', { name: '3 new notifications' })
    expect(el).toBeInTheDocument()
  })

  it('forwards aria-describedby to the DOM element', () => {
    render(<Badge aria-describedby="desc">Badge</Badge>)
    expect(screen.getByRole('status')).toHaveAttribute('aria-describedby', 'desc')
  })
})

// ---------------------------------------------------------------------------
// 4. Prop forwarding — ...rest reaches the DOM element
// ---------------------------------------------------------------------------
describe('Badge — prop forwarding', () => {
  it('forwards data-testid', () => {
    render(<Badge data-testid="my-badge">Label</Badge>)
    expect(screen.getByTestId('my-badge')).toBeInTheDocument()
  })

  it('forwards onClick and fires the handler', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Badge onClick={handleClick}>Clickable</Badge>)
    await user.click(screen.getByRole('status'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('merges a custom className with the generated class list', () => {
    render(<Badge className="custom-class">Label</Badge>)
    const el = screen.getByRole('status')
    expect(el.className).toContain('custom-class')
    // base class should also still be present
    expect(el.className).toContain(styles.badge)
  })
})

// ---------------------------------------------------------------------------
// 5. CSS Module integrity — every key the component uses must exist in the
//    imported styles object (guards against typos between .tsx and .module.css)
// ---------------------------------------------------------------------------
describe('Badge — CSS module integrity', () => {
  it('styles.badge is defined', () => {
    expect(styles.badge).toBeTruthy()
  })

  const variants: BadgeVariant[] = [
    'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'outline',
  ]
  variants.forEach((variant) => {
    it(`styles["variant-${variant}"] is defined`, () => {
      expect(styles[`variant-${variant}` as keyof typeof styles]).toBeTruthy()
    })
  })

  const sizes: BadgeSize[] = ['sm', 'md', 'lg']
  sizes.forEach((size) => {
    it(`styles["size-${size}"] is defined`, () => {
      expect(styles[`size-${size}` as keyof typeof styles]).toBeTruthy()
    })
  })
})

// ---------------------------------------------------------------------------
// 6. Variant class application
// ---------------------------------------------------------------------------
describe('Badge — variant class application', () => {
  const variants: BadgeVariant[] = [
    'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'outline',
  ]

  variants.forEach((variant) => {
    it(`applies the correct CSS class for variant="${variant}"`, () => {
      render(<Badge variant={variant} data-testid={`badge-${variant}`}>{variant}</Badge>)
      const el = screen.getByTestId(`badge-${variant}`)
      expect(el.className).toContain(styles[`variant-${variant}` as keyof typeof styles])
    })
  })

  it('defaults to variant="default" when no variant prop is supplied', () => {
    render(<Badge data-testid="badge-novariant">Label</Badge>)
    const el = screen.getByTestId('badge-novariant')
    expect(el.className).toContain(styles['variant-default'])
  })

  it('does not apply a class for an omitted variant', () => {
    render(<Badge data-testid="badge-check">Label</Badge>)
    const el = screen.getByTestId('badge-check')
    // No "variant-primary" class when we render with default variant
    expect(el.className).not.toContain(styles['variant-primary'])
  })
})

// ---------------------------------------------------------------------------
// 7. Size class application
// ---------------------------------------------------------------------------
describe('Badge — size class application', () => {
  const sizes: BadgeSize[] = ['sm', 'md', 'lg']

  sizes.forEach((size) => {
    it(`applies the correct CSS class for size="${size}"`, () => {
      render(<Badge size={size} data-testid={`badge-size-${size}`}>{size}</Badge>)
      const el = screen.getByTestId(`badge-size-${size}`)
      expect(el.className).toContain(styles[`size-${size}` as keyof typeof styles])
    })
  })

  it('defaults to size="md" when no size prop is supplied', () => {
    render(<Badge data-testid="badge-nosize">Label</Badge>)
    const el = screen.getByTestId('badge-nosize')
    expect(el.className).toContain(styles['size-md'])
  })
})

// ---------------------------------------------------------------------------
// 8. Base class is always applied regardless of variant / size
// ---------------------------------------------------------------------------
describe('Badge — base class invariant', () => {
  it('always carries the base styles.badge class', () => {
    render(<Badge variant="danger" size="lg" data-testid="base-check">!</Badge>)
    expect(screen.getByTestId('base-check').className).toContain(styles.badge)
  })
})

// ---------------------------------------------------------------------------
// 9. displayName
// ---------------------------------------------------------------------------
describe('Badge — displayName', () => {
  it('has displayName "Badge"', () => {
    expect(Badge.displayName).toBe('Badge')
  })
})
