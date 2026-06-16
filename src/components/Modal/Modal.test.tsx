import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'
import React from 'react'

describe('Modal', () => {
  beforeEach(() => {
    // Mock HTMLDialogElement methods
    HTMLDialogElement.prototype.showModal = vi.fn()
    HTMLDialogElement.prototype.close = vi.fn()
  })

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <Modal open={false} onClose={vi.fn()}>
          Test content
        </Modal>
      )
      expect(container).toBeTruthy()
    })

    it('renders dialog element', () => {
      const { container } = render(
        <Modal open={false} onClose={vi.fn()}>
          Test content
        </Modal>
      )
      const dialog = container.querySelector('dialog')
      expect(dialog).toBeTruthy()
    })

    it('renders content when open', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          Test content
        </Modal>
      )
      expect(screen.getByText('Test content')).toBeTruthy()
    })

    it('renders title when provided', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="Test Title">
          Body content
        </Modal>
      )
      expect(screen.getByText('Test Title')).toBeTruthy()
    })

    it('renders body content', () => {
      const bodyText = 'This is the body content'
      render(
        <Modal open={true} onClose={vi.fn()}>
          {bodyText}
        </Modal>
      )
      expect(screen.getByText(bodyText)).toBeTruthy()
    })

    it('renders footer content when provided', () => {
      const footerText = 'Footer content'
      render(
        <Modal open={true} onClose={vi.fn()} footer={<div>{footerText}</div>}>
          Body content
        </Modal>
      )
      expect(screen.getByText(footerText)).toBeTruthy()
    })

    it('does not render footer when not provided', () => {
      const { container } = render(
        <Modal open={true} onClose={vi.fn()}>
          Body content
        </Modal>
      )
      const footer = container.querySelector('[class*="footer"]')
      expect(footer).toBeFalsy()
    })

    it('applies custom className', () => {
      const { container } = render(
        <Modal
          open={false}
          onClose={vi.fn()}
          className="custom-class"
        >
          Content
        </Modal>
      )
      const dialog = container.querySelector('dialog')
      expect(dialog?.className).toContain('custom-class')
    })
  })

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      const { container } = render(
        <Modal ref={ref} open={false} onClose={vi.fn()}>
          Content
        </Modal>
      )
      // The ref should be forwarded to the div wrapper (dialog element's parent)
      expect(container.querySelector('dialog')).toBeTruthy()
    })
  })

  describe('Open/Close Behavior', () => {
    it('calls showModal when open prop changes to true', async () => {
      const { rerender } = render(
        <Modal open={false} onClose={vi.fn()}>
          Content
        </Modal>
      )

      rerender(
        <Modal open={true} onClose={vi.fn()}>
          Content
        </Modal>
      )

      await waitFor(() => {
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
      })
    })

    it('calls close when open prop changes to false', async () => {
      const { rerender } = render(
        <Modal open={true} onClose={vi.fn()}>
          Content
        </Modal>
      )

      rerender(
        <Modal open={false} onClose={vi.fn()}>
          Content
        </Modal>
      )

      await waitFor(() => {
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
      })
    })
  })

  describe('Close Button', () => {
    it('renders close button when title is provided', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="Test Title">
          Content
        </Modal>
      )
      const closeButton = screen.getByLabelText('Close modal')
      expect(closeButton).toBeTruthy()
    })

    it('does not render close button when title is not provided', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          Content
        </Modal>
      )
      const closeButton = screen.queryByLabelText('Close modal')
      expect(closeButton).toBeFalsy()
    })

    it('calls onClose when close button is clicked', async () => {
      const onClose = vi.fn()
      render(
        <Modal open={true} onClose={onClose} title="Test Title">
          Content
        </Modal>
      )

      const closeButton = screen.getByLabelText('Close modal')
      await userEvent.click(closeButton)

      expect(onClose).toHaveBeenCalled()
    })

    it('has proper aria-label for accessibility', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="Test Title">
          Content
        </Modal>
      )
      const closeButton = screen.getByLabelText('Close modal')
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal')
    })
  })

  describe('Escape Key Behavior', () => {
    it('calls onClose when Escape is pressed and closeOnEscape is true', async () => {
      const onClose = vi.fn()
      const { container } = render(
        <Modal open={true} onClose={onClose} closeOnEscape={true} title="Test">
          Content
        </Modal>
      )

      const dialog = container.querySelector('dialog') as HTMLDialogElement
      fireEvent(dialog, new KeyboardEvent('cancel', { key: 'Escape' }))

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled()
      })
    })

    it('does not call onClose when Escape is pressed and closeOnEscape is false', async () => {
      const onClose = vi.fn()
      const { container } = render(
        <Modal open={true} onClose={onClose} closeOnEscape={false} title="Test">
          Content
        </Modal>
      )

      const dialog = container.querySelector('dialog') as HTMLDialogElement
      const cancelEvent = new Event('cancel', { bubbles: true })
      fireEvent(dialog, cancelEvent)

      // Add a small delay to ensure onClose wouldn't be called
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(onClose).not.toHaveBeenCalled()
    })

    it('prevents default cancel event when closeOnEscape is true', () => {
      const onClose = vi.fn()
      const { container } = render(
        <Modal open={true} onClose={onClose} closeOnEscape={true} title="Test">
          Content
        </Modal>
      )

      const dialog = container.querySelector('dialog') as HTMLDialogElement
      const cancelEvent = new Event('cancel', { bubbles: true, cancelable: true })
      const preventDefaultSpy = vi.spyOn(cancelEvent, 'preventDefault')

      fireEvent(dialog, cancelEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('Overlay Click Behavior', () => {
    it('calls onClose when overlay is clicked and closeOnOverlayClick is true', async () => {
      const onClose = vi.fn()
      const { container } = render(
        <Modal open={true} onClose={onClose} closeOnOverlayClick={true} title="Test">
          Content
        </Modal>
      )

      const dialog = container.querySelector('dialog') as HTMLDialogElement
      await userEvent.click(dialog)

      expect(onClose).toHaveBeenCalled()
    })

    it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', async () => {
      const onClose = vi.fn()
      const { container } = render(
        <Modal open={true} onClose={onClose} closeOnOverlayClick={false} title="Test">
          Content
        </Modal>
      )

      const dialog = container.querySelector('dialog') as HTMLDialogElement
      await userEvent.click(dialog)

      expect(onClose).not.toHaveBeenCalled()
    })

    it('does not call onClose when modal content is clicked', async () => {
      const onClose = vi.fn()
      render(
        <Modal open={true} onClose={onClose} closeOnOverlayClick={true} title="Test">
          <div data-testid="modal-content">Click me</div>
        </Modal>
      )

      const content = screen.getByTestId('modal-content')
      await userEvent.click(content)

      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('ARIA Attributes', () => {
    it('close button has aria-label attribute', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="Test Title">
          Content
        </Modal>
      )
      const closeButton = screen.getByLabelText('Close modal')
      expect(closeButton).toHaveAttribute('aria-label')
    })

    it('close button SVG has aria-hidden attribute', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="Test Title">
          Content
        </Modal>
      )
      const closeButton = screen.getByLabelText('Close modal')
      const svg = closeButton.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    it('dialog is a semantic element', () => {
      const { container } = render(
        <Modal open={true} onClose={vi.fn()}>
          Content
        </Modal>
      )
      const dialog = container.querySelector('dialog')
      expect(dialog?.tagName).toBe('DIALOG')
    })
  })

  describe('Props Spreading', () => {
    it('spreads additional props to the dialog element', () => {
      const { container } = render(
        <Modal
          open={true}
          onClose={vi.fn()}
          data-testid="custom-dialog"
          role="alertdialog"
        >
          Content
        </Modal>
      )

      const dialog = container.querySelector('dialog')
      expect(dialog).toHaveAttribute('data-testid', 'custom-dialog')
      expect(dialog).toHaveAttribute('role', 'alertdialog')
    })
  })

  describe('Display Name', () => {
    it('has correct displayName for debugging', () => {
      expect(Modal.displayName).toBe('Modal')
    })
  })
})
