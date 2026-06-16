import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders without crashing', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with children text', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Test Button')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.textContent).toContain('Test')
  })

  describe('Click Handler', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button')

      await userEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          Click me
        </Button>
      )
      const button = screen.getByRole('button')

      await userEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', async () => {
      const handleClick = vi.fn()
      render(
        <Button loading onClick={handleClick}>
          Click me
        </Button>
      )
      const button = screen.getByRole('button')

      await userEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Variants', () => {
    it('renders primary variant', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('variant-primary')
    })

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('variant-secondary')
    })

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('variant-ghost')
    })

    it('renders danger variant', () => {
      render(<Button variant="danger">Danger</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('variant-danger')
    })

    it('defaults to primary variant when not specified', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('variant-primary')
    })
  })

  describe('Sizes', () => {
    it('renders small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('size-sm')
    })

    it('renders medium size', () => {
      render(<Button size="md">Medium</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('size-md')
    })

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('size-lg')
    })

    it('defaults to medium size when not specified', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('size-md')
    })
  })

  describe('Disabled State', () => {
    it('renders with disabled attribute when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('applies disabled class when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('disabled')
    })

    it('sets aria-disabled when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('does not set aria-disabled when not disabled', () => {
      render(<Button>Active</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'false')
    })
  })

  describe('Loading State', () => {
    it('renders loading state', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('loading')
    })

    it('sets aria-busy when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
    })

    it('does not set aria-busy when not loading', () => {
      render(<Button>Not Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'false')
    })

    it('disables button when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('applies disabled class when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('disabled')
    })

    it('renders spinner element when loading', () => {
      render(<Button loading>Loading</Button>)
      const spinner = screen.getByRole('button').querySelector('[aria-hidden="true"]')
      expect(spinner).toBeInTheDocument()
    })

    it('spinner has aria-hidden attribute', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      const spinner = button.querySelector('.spinner')
      expect(spinner).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Keyboard Interaction', () => {
    it('can be activated with Enter key', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button')

      button.focus()
      await userEvent.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalled()
    })

    it('can be activated with Space key', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button')

      button.focus()
      await userEvent.keyboard(' ')
      expect(handleClick).toHaveBeenCalled()
    })

    it('does not activate with Enter when disabled', async () => {
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          Click me
        </Button>
      )
      const button = screen.getByRole('button')

      button.focus()
      await userEvent.keyboard('{Enter}')
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('can receive focus', async () => {
      render(<Button>Focusable</Button>)
      const button = screen.getByRole('button')
      await userEvent.tab()
      expect(button).toHaveFocus()
    })
  })

  describe('ARIA Attributes', () => {
    it('is accessible with proper role', () => {
      render(<Button>Accessible Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has aria-busy attribute', () => {
      render(<Button>Test</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy')
    })

    it('has aria-disabled attribute', () => {
      render(<Button>Test</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled')
    })

    it('supports custom aria attributes', () => {
      render(<Button aria-label="Custom Label">Test</Button>)
      const button = screen.getByRole('button', { name: /custom label/i })
      expect(button).toBeInTheDocument()
    })

    it('supports aria-describedby for descriptions', () => {
      render(
        <>
          <span id="desc">This is a description</span>
          <Button aria-describedby="desc">Test</Button>
        </>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'desc')
    })
  })

  describe('Custom Classes', () => {
    it('accepts custom className and merges with default classes', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('custom-class')
      expect(button.className).toContain('button')
    })

    it('maintains all variant and size classes with custom className', () => {
      render(
        <Button variant="danger" size="lg" className="extra">
          Test
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button.className).toContain('variant-danger')
      expect(button.className).toContain('size-lg')
      expect(button.className).toContain('extra')
    })
  })

  describe('Button Attributes', () => {
    it('forwards standard button attributes', () => {
      render(
        <Button data-testid="custom-button" type="submit">
          Submit
        </Button>
      )
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('supports type prop', () => {
      render(<Button type="button">Button</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('has displayName set for debugging', () => {
      expect(Button.displayName).toBe('Button')
    })
  })

  describe('Content Rendering', () => {
    it('wraps children in content span', () => {
      render(<Button>Content</Button>)
      const button = screen.getByRole('button')
      const content = button.querySelector('.content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveTextContent('Content')
    })

    it('renders with React node children', () => {
      render(
        <Button>
          <span>Complex</span>
          <span>Children</span>
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('ComplexChildren')
    })
  })

  describe('Loading with Other States', () => {
    it('loading state takes precedence over disabled prop', () => {
      render(<Button loading disabled>
        Test
      </Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button.className).toContain('loading')
      expect(button.className).toContain('disabled')
    })

    it('renders loading spinner with variant classes', () => {
      render(
        <Button variant="secondary" loading>
          Loading
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button.className).toContain('variant-secondary')
      expect(button.className).toContain('loading')
    })
  })
})
