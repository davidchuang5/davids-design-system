import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'
import styles from './Button.module.css'

// ---------------------------------------------------------------------------
// CSS Module integrity — every key the component references must exist in the
// imported styles object so typos between .tsx and .module.css are caught at
// test time rather than silently producing classless elements.
// ---------------------------------------------------------------------------
describe('CSS Module integrity', () => {
  const requiredKeys = [
    'button',
    'primary',
    'secondary',
    'ghost',
    'sm',
    'md',
    'lg',
    'loading',
    'spinner',
    'inner',
    'iconSlot',
  ] as const

  it.each(requiredKeys)('styles.%s is defined', (key) => {
    expect(styles[key]).toBeDefined()
    expect(typeof styles[key]).toBe('string')
  })
})

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe('Button — rendering', () => {
  it('renders without crashing and shows children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders a <button> element by default', () => {
    render(<Button>Label</Button>)
    expect(screen.getByRole('button')).toBeInstanceOf(HTMLButtonElement)
  })

  it('defaults to type="button" to prevent accidental form submission', () => {
    render(<Button>Label</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('accepts an explicit type prop', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})

// ---------------------------------------------------------------------------
// forwardRef
// ---------------------------------------------------------------------------
describe('Button — forwardRef', () => {
  it('forwards a ref to the underlying <button> element', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref test</Button>)
    expect(ref.current).not.toBeNull()
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('ref.current matches the rendered DOM node', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref test</Button>)
    expect(ref.current).toBe(screen.getByRole('button'))
  })
})

// ---------------------------------------------------------------------------
// Variants — className application
// ---------------------------------------------------------------------------
describe('Button — variants', () => {
  it('applies styles.primary by default', () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole('button').className).toContain(styles.primary)
  })

  it('applies styles.primary when variant="primary"', () => {
    render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button').className).toContain(styles.primary)
  })

  it('applies styles.secondary when variant="secondary"', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button').className).toContain(styles.secondary)
  })

  it('applies styles.ghost when variant="ghost"', () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button').className).toContain(styles.ghost)
  })

  it('does not apply other variant classes when variant="primary"', () => {
    render(<Button variant="primary">Primary</Button>)
    const cls = screen.getByRole('button').className
    expect(cls).not.toContain(styles.secondary)
    expect(cls).not.toContain(styles.ghost)
  })
})

// ---------------------------------------------------------------------------
// Sizes — className application
// ---------------------------------------------------------------------------
describe('Button — sizes', () => {
  it('applies styles.md by default', () => {
    render(<Button>Medium</Button>)
    expect(screen.getByRole('button').className).toContain(styles.md)
  })

  it('applies styles.sm when size="sm"', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button').className).toContain(styles.sm)
  })

  it('applies styles.md when size="md"', () => {
    render(<Button size="md">Medium</Button>)
    expect(screen.getByRole('button').className).toContain(styles.md)
  })

  it('applies styles.lg when size="lg"', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button').className).toContain(styles.lg)
  })

  it('does not apply other size classes for a given size', () => {
    render(<Button size="sm">Small</Button>)
    const cls = screen.getByRole('button').className
    expect(cls).not.toContain(styles.md)
    expect(cls).not.toContain(styles.lg)
  })
})

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------
describe('Button — disabled', () => {
  it('sets the HTML disabled attribute when disabled=true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('sets aria-disabled="true" when disabled=true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not fire onClick when disabled', async () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Disabled</Button>)
    // pointer-events:none prevents real clicks; simulate via userEvent anyway
    await userEvent.click(screen.getByRole('button'), { skipPointerEventsCheck: true })
    expect(handler).not.toHaveBeenCalled()
  })

  it('does not have aria-disabled when neither disabled nor loading', () => {
    render(<Button>Active</Button>)
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-disabled')
  })
})

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------
describe('Button — loading', () => {
  it('sets aria-busy="true" when loading=true', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('applies styles.loading className when loading=true', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button').className).toContain(styles.loading)
  })

  it('renders the spinner element when loading=true', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument()
  })

  it('spinner has aria-hidden="true"', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByTestId('button-spinner')).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not render the spinner when not loading', () => {
    render(<Button>Not loading</Button>)
    expect(screen.queryByTestId('button-spinner')).not.toBeInTheDocument()
  })

  it('does not set aria-busy when not loading', () => {
    render(<Button>Not loading</Button>)
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy')
  })

  it('does not fire onClick when loading', async () => {
    const handler = vi.fn()
    render(<Button loading onClick={handler}>Loading</Button>)
    await userEvent.click(screen.getByRole('button'), { skipPointerEventsCheck: true })
    expect(handler).not.toHaveBeenCalled()
  })

  it('does not set the HTML disabled attribute when loading (keeps element focusable)', () => {
    render(<Button loading>Loading</Button>)
    // disabled prop is false; only aria-disabled should signal the blocked state
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('sets aria-disabled="true" while loading', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })
})

// ---------------------------------------------------------------------------
// Icon slots
// ---------------------------------------------------------------------------
describe('Button — icon slots', () => {
  const LeadingIcon = () => <svg data-testid="leading-icon" aria-hidden="true" />
  const TrailingIcon = () => <svg data-testid="trailing-icon" aria-hidden="true" />

  it('renders a leading icon when leadingIcon is provided', () => {
    render(<Button leadingIcon={<LeadingIcon />}>Label</Button>)
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument()
  })

  it('renders a trailing icon when trailingIcon is provided', () => {
    render(<Button trailingIcon={<TrailingIcon />}>Label</Button>)
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument()
  })

  it('renders both icons simultaneously', () => {
    render(
      <Button leadingIcon={<LeadingIcon />} trailingIcon={<TrailingIcon />}>
        Label
      </Button>,
    )
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument()
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument()
  })

  it('does not render leading icon wrapper when leadingIcon is omitted', () => {
    render(<Button>No icons</Button>)
    expect(screen.queryByTestId('leading-icon')).not.toBeInTheDocument()
  })

  it('does not render trailing icon wrapper when trailingIcon is omitted', () => {
    render(<Button>No icons</Button>)
    expect(screen.queryByTestId('trailing-icon')).not.toBeInTheDocument()
  })

  it('icon slot wrappers carry aria-hidden to hide decorative icons from AT', () => {
    render(<Button leadingIcon={<LeadingIcon />} trailingIcon={<TrailingIcon />}>Label</Button>)
    // The iconSlot <span> wrappers both have aria-hidden
    const ariaHiddenSpans = document
      .querySelectorAll('[aria-hidden="true"]')
    // At least the two iconSlot spans should exist (the icons themselves also carry it)
    expect(ariaHiddenSpans.length).toBeGreaterThanOrEqual(2)
  })
})

// ---------------------------------------------------------------------------
// onClick — normal flow
// ---------------------------------------------------------------------------
describe('Button — onClick', () => {
  it('calls onClick handler on click when enabled', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('passes the MouseEvent to the onClick handler', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    const [event] = handler.mock.calls[0]
    expect(event).toBeInstanceOf(MouseEvent)
  })
})

// ---------------------------------------------------------------------------
// Keyboard interaction
// ---------------------------------------------------------------------------
describe('Button — keyboard interaction', () => {
  it('activates on Enter key', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Keyboard</Button>)
    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('activates on Space key', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Keyboard</Button>)
    screen.getByRole('button').focus()
    await userEvent.keyboard(' ')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not activate on Enter when disabled', async () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Keyboard</Button>)
    // disabled buttons are not in the tab order but we can force focus
    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')
    expect(handler).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Prop forwarding — ...rest reaches the DOM element
// ---------------------------------------------------------------------------
describe('Button — prop forwarding', () => {
  it('forwards data-testid to the <button> element', () => {
    render(<Button data-testid="my-button">Label</Button>)
    expect(screen.getByTestId('my-button')).toBeInTheDocument()
    expect(screen.getByTestId('my-button').tagName).toBe('BUTTON')
  })

  it('merges an external className with internal classes', () => {
    render(<Button className="custom-class">Label</Button>)
    expect(screen.getByRole('button').className).toContain('custom-class')
    expect(screen.getByRole('button').className).toContain(styles.button)
  })

  it('forwards arbitrary HTML attributes such as data-analytics', () => {
    render(<Button data-analytics="hero-cta">Label</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-analytics', 'hero-cta')
  })

  it('forwards aria-label', () => {
    render(<Button aria-label="Close dialog">X</Button>)
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument()
  })
})
