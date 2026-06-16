import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders without crashing', () => {
    render(
      <Tooltip content="Test content">
        <button>Trigger</button>
      </Tooltip>
    )

    expect(screen.getByText('Trigger')).toBeInTheDocument()
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(
      <Tooltip ref={ref} content="Test content">
        <button>Trigger</button>
      </Tooltip>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.className).toBe(expect.stringContaining('tooltipWrapper'))
  })

  it('displays tooltip content on mouse enter', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()

    fireEvent.mouseEnter(trigger)

    expect(screen.getByText('Tooltip text')).toBeInTheDocument()
  })

  it('hides tooltip content on mouse leave', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')

    fireEvent.mouseEnter(trigger)
    expect(screen.getByText('Tooltip text')).toBeInTheDocument()

    fireEvent.mouseLeave(trigger)
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()
  })

  it('renders tooltip with correct role attribute', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  it('sets aria-describedby on trigger when tooltip is open', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me').parentElement as HTMLElement

    expect(trigger).not.toHaveAttribute('aria-describedby')

    fireEvent.mouseEnter(trigger)

    expect(trigger).toHaveAttribute('aria-describedby', 'tooltip-content')
  })

  it('removes aria-describedby when tooltip closes', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me').parentElement as HTMLElement

    fireEvent.mouseEnter(trigger)
    expect(trigger).toHaveAttribute('aria-describedby', 'tooltip-content')

    fireEvent.mouseLeave(trigger)
    expect(trigger).not.toHaveAttribute('aria-describedby')
  })

  it('closes tooltip when Escape key is pressed', async () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me').parentElement as HTMLElement

    fireEvent.mouseEnter(trigger)
    expect(screen.getByText('Tooltip text')).toBeInTheDocument()

    fireEvent.keyDown(trigger, { key: 'Escape' })

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()
  })

  it('does not close tooltip on other key presses', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me').parentElement as HTMLElement

    fireEvent.mouseEnter(trigger)
    expect(screen.getByText('Tooltip text')).toBeInTheDocument()

    fireEvent.keyDown(trigger, { key: 'Enter' })

    expect(screen.getByText('Tooltip text')).toBeInTheDocument()
  })

  it('respects controlled isOpen prop', () => {
    const { rerender } = render(
      <Tooltip content="Tooltip text" isOpen={false}>
        <button>Trigger</button>
      </Tooltip>
    )

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()

    rerender(
      <Tooltip content="Tooltip text" isOpen={true}>
        <button>Trigger</button>
      </Tooltip>
    )

    expect(screen.getByText('Tooltip text')).toBeInTheDocument()
  })

  it('calls onOpenChange callback when tooltip opens', () => {
    const onOpenChange = vi.fn()

    render(
      <Tooltip content="Tooltip text" onOpenChange={onOpenChange}>
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('calls onOpenChange callback when tooltip closes', () => {
    const onOpenChange = vi.fn()

    render(
      <Tooltip content="Tooltip text" onOpenChange={onOpenChange}>
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    onOpenChange.mockClear()

    fireEvent.mouseLeave(trigger)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('respects showDelay prop', () => {
    render(
      <Tooltip content="Tooltip text" showDelay={500}>
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()

    vi.advanceTimersByTime(500)

    expect(screen.getByText('Tooltip text')).toBeInTheDocument()
  })

  it('respects hideDelay prop', () => {
    render(
      <Tooltip content="Tooltip text" hideDelay={500}>
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    expect(screen.getByText('Tooltip text')).toBeInTheDocument()

    fireEvent.mouseLeave(trigger)
    expect(screen.getByText('Tooltip text')).toBeInTheDocument()

    vi.advanceTimersByTime(500)

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()
  })

  it('renders tooltip with correct placement class', () => {
    const { rerender } = render(
      <Tooltip content="Tooltip text" placement="top">
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    let tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveClass('placement-top')

    rerender(
      <Tooltip content="Tooltip text" placement="right">
        <button>Hover me</button>
      </Tooltip>
    )

    tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveClass('placement-right')
  })

  it('renders with ReactNode content', () => {
    render(
      <Tooltip content={<strong>Bold tooltip</strong>}>
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    const boldText = screen.getByText('Bold tooltip')
    expect(boldText.tagName).toBe('STRONG')
  })

  it('trigger has correct accessibility attributes', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me').parentElement as HTMLElement

    expect(trigger).toHaveAttribute('role', 'button')
    expect(trigger).toHaveAttribute('tabIndex', '0')
  })

  it('does not show tooltip if mouse leaves before showDelay completes', () => {
    render(
      <Tooltip content="Tooltip text" showDelay={500}>
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    vi.advanceTimersByTime(250)
    fireEvent.mouseLeave(trigger)

    vi.advanceTimersByTime(250)

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()
  })

  it('clears timeouts on unmount', () => {
    const { unmount } = render(
      <Tooltip content="Tooltip text" showDelay={500}>
        <button>Hover me</button>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('accepts additional HTML attributes', () => {
    const { container } = render(
      <Tooltip content="Tooltip text" data-testid="custom-tooltip" className="custom-class">
        <button>Hover me</button>
      </Tooltip>
    )

    const tooltipWrapper = screen.getByTestId('custom-tooltip')
    expect(tooltipWrapper).toHaveClass('custom-class')
  })
})
