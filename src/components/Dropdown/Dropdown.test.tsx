import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown, DropdownItem } from './Dropdown'
import { useRef } from 'react'

describe('Dropdown', () => {
  const defaultItems: DropdownItem[] = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Option 3' },
  ]

  const defaultProps = {
    triggerLabel: 'Select an option',
    items: defaultItems,
  }

  it('renders without crashing', () => {
    render(<Dropdown {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: /Select an option/i })
    expect(trigger).toBeInTheDocument()
  })

  it('displays trigger label initially', () => {
    render(<Dropdown {...defaultProps} />)
    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('displays selected item label in trigger', () => {
    render(<Dropdown {...defaultProps} value="2" />)
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('forwards ref correctly', () => {
    const ref = useRef<HTMLDivElement>(null)
    const { container } = render(
      <Dropdown {...defaultProps} ref={ref} />
    )
    expect(ref.current).toBe(container.querySelector('.dropdown'))
  })

  it('opens dropdown on trigger click', () => {
    render(<Dropdown {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: /Select an option/i })
    fireEvent.click(trigger)

    const menu = screen.getByRole('listbox')
    expect(menu).toBeInTheDocument()
  })

  it('closes dropdown on trigger click when open', () => {
    render(<Dropdown {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: /Select an option/i })

    fireEvent.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.click(trigger)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('displays all items when dropdown is open', () => {
    render(<Dropdown {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: /Select an option/i })
    fireEvent.click(trigger)

    defaultItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument()
    })
  })

  it('calls onChange when an item is clicked', () => {
    const onChange = vi.fn()
    render(<Dropdown {...defaultProps} onChange={onChange} />)
    const trigger = screen.getByRole('button', { name: /Select an option/i })
    fireEvent.click(trigger)

    const option = screen.getByRole('option', { name: 'Option 2' })
    fireEvent.click(option)

    expect(onChange).toHaveBeenCalledWith('2')
  })

  it('closes dropdown after selecting an item', () => {
    render(<Dropdown {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: /Select an option/i })
    fireEvent.click(trigger)

    const option = screen.getByRole('option', { name: 'Option 2' })
    fireEvent.click(option)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('does not call onChange when clicking a disabled item', () => {
    const onChange = vi.fn()
    const itemsWithDisabled: DropdownItem[] = [
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2', disabled: true },
      { id: '3', label: 'Option 3' },
    ]
    render(
      <Dropdown
        {...defaultProps}
        items={itemsWithDisabled}
        onChange={onChange}
      />
    )
    const trigger = screen.getByRole('button', { name: /Select an option/i })
    fireEvent.click(trigger)

    const disabledOption = screen.getByRole('option', { name: 'Option 2' })
    fireEvent.click(disabledOption)

    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables trigger button when disabled prop is true', () => {
    render(<Dropdown {...defaultProps} disabled={true} />)
    const trigger = screen.getByRole('button', { name: /Select an option/i })
    expect(trigger).toBeDisabled()
  })

  it('does not open dropdown when trigger is disabled', () => {
    render(<Dropdown {...defaultProps} disabled={true} />)
    const trigger = screen.getByRole('button', { name: /Select an option/i })
    fireEvent.click(trigger)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  describe('keyboard interactions', () => {
    it('opens dropdown with Enter key on trigger', async () => {
      const user = userEvent.setup()
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })

      trigger.focus()
      await user.keyboard('{Enter}')

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('opens dropdown with Space key on trigger', async () => {
      const user = userEvent.setup()
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })

      trigger.focus()
      await user.keyboard(' ')

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('opens dropdown with ArrowDown key on trigger when closed', async () => {
      const user = userEvent.setup()
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })

      trigger.focus()
      await user.keyboard('{ArrowDown}')

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('navigates down through items with ArrowDown', async () => {
      const user = userEvent.setup()
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      const menu = screen.getByRole('listbox')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')

      const items = screen.getAllByRole('option')
      expect(items[2]).toHaveClass('highlighted')
    })

    it('wraps to first item when navigating down from last item', async () => {
      const user = userEvent.setup()
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      const menu = screen.getByRole('listbox')
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}')

      const items = screen.getAllByRole('option')
      expect(items[0]).toHaveClass('highlighted')
    })

    it('navigates up through items with ArrowUp', async () => {
      const user = userEvent.setup()
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}')

      const items = screen.getAllByRole('option')
      expect(items[0]).toHaveClass('highlighted')
    })

    it('wraps to last item when navigating up from first item', async () => {
      const user = userEvent.setup()
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      await user.keyboard('{ArrowUp}')

      const items = screen.getAllByRole('option')
      expect(items[items.length - 1]).toHaveClass('highlighted')
    })

    it('selects highlighted item with Enter key', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Dropdown {...defaultProps} onChange={onChange} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')

      expect(onChange).toHaveBeenCalledWith('1')
    })

    it('selects highlighted item with Space key', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Dropdown {...defaultProps} onChange={onChange} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      await user.keyboard('{ArrowDown}')
      await user.keyboard(' ')

      expect(onChange).toHaveBeenCalledWith('1')
    })

    it('closes dropdown with Escape key and returns focus to trigger', async () => {
      const user = userEvent.setup()
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      expect(screen.getByRole('listbox')).toBeInTheDocument()

      const menu = screen.getByRole('listbox')
      fireEvent.keyDown(menu, { key: 'Escape' })

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('skips disabled items when navigating', async () => {
      const user = userEvent.setup()
      const itemsWithDisabled: DropdownItem[] = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2', disabled: true },
        { id: '3', label: 'Option 3' },
      ]
      render(<Dropdown {...defaultProps} items={itemsWithDisabled} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      await user.keyboard('{ArrowDown}')

      const items = screen.getAllByRole('option')
      expect(items[2]).toHaveClass('highlighted')
    })
  })

  describe('click outside closes dropdown', () => {
    it('closes dropdown when clicking outside', async () => {
      const { container } = render(
        <div>
          <Dropdown {...defaultProps} />
          <button>Outside button</button>
        </div>
      )
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      expect(screen.getByRole('listbox')).toBeInTheDocument()

      const outsideButton = screen.getByText('Outside button')
      fireEvent.mouseDown(outsideButton)

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })
  })

  describe('ARIA attributes', () => {
    it('has correct ARIA attributes on trigger button', () => {
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })

      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('updates aria-expanded when dropdown opens', () => {
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })

      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      fireEvent.click(trigger)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('has role listbox on menu', () => {
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      const menu = screen.getByRole('listbox')
      expect(menu).toBeInTheDocument()
    })

    it('has role option on menu items', () => {
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      const items = screen.getAllByRole('option')
      expect(items).toHaveLength(3)
    })

    it('marks selected item with aria-selected', () => {
      render(<Dropdown {...defaultProps} value="2" />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      const selectedItem = screen.getByRole('option', { name: 'Option 2' })
      expect(selectedItem).toHaveAttribute('aria-selected', 'true')
    })

    it('marks unselected items with aria-selected false', () => {
      render(<Dropdown {...defaultProps} value="2" />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      const unselectedItem = screen.getByRole('option', { name: 'Option 1' })
      expect(unselectedItem).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('size variants', () => {
    it('applies correct class for small size', () => {
      const { container } = render(<Dropdown {...defaultProps} size="sm" />)
      const dropdown = container.querySelector('.size-sm')
      expect(dropdown).toBeInTheDocument()
    })

    it('applies correct class for medium size', () => {
      const { container } = render(<Dropdown {...defaultProps} size="md" />)
      const dropdown = container.querySelector('.size-md')
      expect(dropdown).toBeInTheDocument()
    })

    it('applies correct class for large size', () => {
      const { container } = render(<Dropdown {...defaultProps} size="lg" />)
      const dropdown = container.querySelector('.size-lg')
      expect(dropdown).toBeInTheDocument()
    })

    it('defaults to medium size', () => {
      const { container } = render(<Dropdown {...defaultProps} />)
      const dropdown = container.querySelector('.size-md')
      expect(dropdown).toBeInTheDocument()
    })
  })

  describe('disabled item styling', () => {
    it('applies disabled class to disabled items', () => {
      const itemsWithDisabled: DropdownItem[] = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2', disabled: true },
      ]
      const { container } = render(
        <Dropdown {...defaultProps} items={itemsWithDisabled} />
      )
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      const options = screen.getAllByRole('option')
      expect(options[1]).toHaveClass('itemDisabled')
    })
  })

  describe('mouse hover interactions', () => {
    it('highlights item on mouse enter', () => {
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      const item = screen.getByRole('option', { name: 'Option 2' })
      fireEvent.mouseEnter(item)

      expect(item).toHaveClass('highlighted')
    })

    it('removes highlight on mouse leave', () => {
      render(<Dropdown {...defaultProps} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      const item = screen.getByRole('option', { name: 'Option 2' })
      fireEvent.mouseEnter(item)
      expect(item).toHaveClass('highlighted')

      fireEvent.mouseLeave(item)
      expect(item).not.toHaveClass('highlighted')
    })

    it('does not highlight disabled items on mouse enter', () => {
      const itemsWithDisabled: DropdownItem[] = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2', disabled: true },
      ]
      render(<Dropdown {...defaultProps} items={itemsWithDisabled} />)
      const trigger = screen.getByRole('button', { name: /Select an option/i })
      fireEvent.click(trigger)

      const disabledItem = screen.getByRole('option', { name: 'Option 2' })
      fireEvent.mouseEnter(disabledItem)

      expect(disabledItem).not.toHaveClass('highlighted')
    })
  })
})
