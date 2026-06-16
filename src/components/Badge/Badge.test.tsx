import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'
import React from 'react'

describe('Badge', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<Badge>Badge Text</Badge>)
      expect(screen.getByText('Badge Text')).toBeInTheDocument()
    })

    it('should render as a span element', () => {
      const { container } = render(<Badge>Test</Badge>)
      const element = container.querySelector('span')
      expect(element).toBeInTheDocument()
    })

    it('should render children correctly', () => {
      render(<Badge>Hello Badge</Badge>)
      expect(screen.getByText('Hello Badge')).toBeInTheDocument()
    })

    it('should render empty when no children provided', () => {
      const { container } = render(<Badge />)
      const element = container.querySelector('span')
      expect(element).toBeInTheDocument()
      expect(element?.textContent).toBe('')
    })
  })

  describe('variant prop', () => {
    it('should render with default variant by default', () => {
      const { container } = render(<Badge>Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('variant-default')
    })

    it('should render with primary variant', () => {
      const { container } = render(<Badge variant="primary">Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('variant-primary')
    })

    it('should render with success variant', () => {
      const { container } = render(<Badge variant="success">Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('variant-success')
    })

    it('should render with warning variant', () => {
      const { container } = render(<Badge variant="warning">Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('variant-warning')
    })

    it('should render with danger variant', () => {
      const { container } = render(<Badge variant="danger">Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('variant-danger')
    })
  })

  describe('size prop', () => {
    it('should render with md size by default', () => {
      const { container } = render(<Badge>Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('size-md')
    })

    it('should render with sm size', () => {
      const { container } = render(<Badge size="sm">Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('size-sm')
    })

    it('should render with md size', () => {
      const { container } = render(<Badge size="md">Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('size-md')
    })

    it('should render with lg size', () => {
      const { container } = render(<Badge size="lg">Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('size-lg')
    })
  })

  describe('className prop', () => {
    it('should accept custom className', () => {
      const { container } = render(<Badge className="custom-class">Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('custom-class')
    })

    it('should combine custom className with variant and size classes', () => {
      const { container } = render(
        <Badge variant="primary" size="lg" className="custom">
          Test
        </Badge>
      )
      const element = container.querySelector('span')
      expect(element?.className).toContain('variant-primary')
      expect(element?.className).toContain('size-lg')
      expect(element?.className).toContain('custom')
    })

    it('should apply badge base class', () => {
      const { container } = render(<Badge>Test</Badge>)
      const element = container.querySelector('span')
      expect(element?.className).toContain('badge')
    })
  })

  describe('ref forwarding', () => {
    it('should forward ref to span element', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Badge ref={ref}>Test</Badge>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    it('should allow accessing span properties via ref', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Badge ref={ref}>Test Badge</Badge>)
      expect(ref.current?.textContent).toBe('Test Badge')
    })

    it('should allow accessing span methods via ref', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Badge ref={ref}>Test</Badge>)
      expect(typeof ref.current?.addEventListener).toBe('function')
    })
  })

  describe('HTML attributes', () => {
    it('should accept and apply HTML attributes', () => {
      const { container } = render(
        <Badge data-testid="custom-badge" title="Badge Title">
          Test
        </Badge>
      )
      const element = container.querySelector('span')
      expect(element?.getAttribute('data-testid')).toBe('custom-badge')
      expect(element?.getAttribute('title')).toBe('Badge Title')
    })

    it('should accept aria attributes', () => {
      const { container } = render(
        <Badge aria-label="Important" role="status">
          Test
        </Badge>
      )
      const element = container.querySelector('span')
      expect(element?.getAttribute('aria-label')).toBe('Important')
      expect(element?.getAttribute('role')).toBe('status')
    })

    it('should accept data attributes', () => {
      const { container } = render(
        <Badge data-variant="custom" data-index="1">
          Test
        </Badge>
      )
      const element = container.querySelector('span')
      expect(element?.getAttribute('data-variant')).toBe('custom')
      expect(element?.getAttribute('data-index')).toBe('1')
    })
  })

  describe('combination tests', () => {
    it('should render all variant and size combinations', () => {
      const variants: Array<'default' | 'primary' | 'success' | 'warning' | 'danger'> = [
        'default',
        'primary',
        'success',
        'warning',
        'danger',
      ]
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { container } = render(
            <Badge variant={variant} size={size}>
              Test
            </Badge>
          )
          const element = container.querySelector('span')
          expect(element?.className).toContain(`variant-${variant}`)
          expect(element?.className).toContain(`size-${size}`)
        })
      })
    })
  })

  describe('displayName', () => {
    it('should have correct displayName', () => {
      expect(Badge.displayName).toBe('Badge')
    })
  })
})
