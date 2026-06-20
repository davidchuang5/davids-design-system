import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from './Accordion'
import type { AccordionItem, AccordionVariant, AccordionSize } from './Accordion'
import styles from './Accordion.module.css'

// ---------------------------------------------------------------------------
// Shared fixture data
// ---------------------------------------------------------------------------

const THREE_ITEMS: AccordionItem[] = [
  { id: 'a', trigger: 'Panel A', content: 'Content A' },
  { id: 'b', trigger: 'Panel B', content: 'Content B' },
  { id: 'c', trigger: 'Panel C', content: 'Content C' },
]

const TWO_ITEMS: AccordionItem[] = [
  { id: 'x', trigger: 'Panel X', content: 'Content X' },
  { id: 'y', trigger: 'Panel Y', content: 'Content Y' },
]

// ---------------------------------------------------------------------------
// 1. CSS Module integrity
//    Every className token the component references must exist in the imported
//    styles object. A typo in the .tsx produces undefined → no class applied.
// ---------------------------------------------------------------------------

describe('Accordion — CSS module integrity', () => {
  const requiredKeys = [
    'accordion',
    'item',
    'itemOpen',
    'itemDisabled',
    'heading',
    'trigger',
    'triggerLabel',
    'chevron',
    'panel',
    'panelInner',
    // variant keys
    'variant-default',
    'variant-bordered',
    'variant-flush',
    // size keys
    'size-sm',
    'size-md',
    'size-lg',
  ] as const

  it.each(requiredKeys)('styles["%s"] is defined and is a string', (key) => {
    expect(styles[key as keyof typeof styles]).toBeDefined()
    expect(typeof styles[key as keyof typeof styles]).toBe('string')
  })
})

// ---------------------------------------------------------------------------
// 2. Renders without crashing
// ---------------------------------------------------------------------------

describe('Accordion — rendering', () => {
  it('renders without crashing given a minimal items array', () => {
    render(<Accordion items={TWO_ITEMS} />)
    expect(screen.getByText('Panel X')).toBeInTheDocument()
    expect(screen.getByText('Panel Y')).toBeInTheDocument()
  })

  it('renders a <div> as the root element', () => {
    render(<Accordion items={TWO_ITEMS} data-testid="root" />)
    expect(screen.getByTestId('root').tagName).toBe('DIV')
  })

  it('renders one trigger button per item', () => {
    render(<Accordion items={THREE_ITEMS} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('renders one region panel per item', () => {
    render(<Accordion items={THREE_ITEMS} />)
    expect(screen.getAllByRole('region', { hidden: true })).toHaveLength(3)
  })

  it('renders trigger text inside each button', () => {
    render(<Accordion items={THREE_ITEMS} />)
    expect(screen.getByRole('button', { name: 'Panel A' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Panel B' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Panel C' })).toBeInTheDocument()
  })

  it('wraps each trigger in an <h3>', () => {
    render(<Accordion items={TWO_ITEMS} />)
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(2)
  })

  it('has displayName "Accordion"', () => {
    expect(Accordion.displayName).toBe('Accordion')
  })
})

// ---------------------------------------------------------------------------
// 3. forwardRef
// ---------------------------------------------------------------------------

describe('Accordion — forwardRef', () => {
  it('forwards a ref to the root <div>', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Accordion items={TWO_ITEMS} ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('ref.current matches the rendered root DOM node', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Accordion items={TWO_ITEMS} ref={ref} data-testid="root" />)
    expect(ref.current).toBe(screen.getByTestId('root'))
  })
})

// ---------------------------------------------------------------------------
// 4. ARIA attributes
// ---------------------------------------------------------------------------

describe('Accordion — ARIA attributes', () => {
  it('each trigger has aria-expanded="false" by default', () => {
    render(<Accordion items={TWO_ITEMS} />)
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('trigger has aria-expanded="true" when item is open (defaultOpenIds)', () => {
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x']} />)
    expect(screen.getByRole('button', { name: 'Panel X' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Panel Y' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('each trigger aria-controls points to the correct panel id', () => {
    render(<Accordion items={TWO_ITEMS} />)
    const btnX = screen.getByRole('button', { name: 'Panel X' })
    const btnY = screen.getByRole('button', { name: 'Panel Y' })

    expect(btnX).toHaveAttribute('aria-controls', 'accordion-panel-x')
    expect(btnY).toHaveAttribute('aria-controls', 'accordion-panel-y')
  })

  it('each trigger has a stable id matching the accordion-trigger-{id} pattern', () => {
    render(<Accordion items={TWO_ITEMS} />)
    expect(screen.getByRole('button', { name: 'Panel X' })).toHaveAttribute(
      'id',
      'accordion-trigger-x',
    )
    expect(screen.getByRole('button', { name: 'Panel Y' })).toHaveAttribute(
      'id',
      'accordion-trigger-y',
    )
  })

  it('each panel has a stable id matching the accordion-panel-{id} pattern', () => {
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x', 'y']} />)
    const panels = screen.getAllByRole('region')
    const panelIds = panels.map((p) => p.getAttribute('id'))
    expect(panelIds).toContain('accordion-panel-x')
    expect(panelIds).toContain('accordion-panel-y')
  })

  it('each panel has role="region"', () => {
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x', 'y']} />)
    const panels = screen.getAllByRole('region')
    expect(panels).toHaveLength(2)
  })

  it('each panel has aria-labelledby pointing to its trigger', () => {
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x', 'y']} />)
    const panelX = document.getElementById('accordion-panel-x')
    const panelY = document.getElementById('accordion-panel-y')
    expect(panelX).toHaveAttribute('aria-labelledby', 'accordion-trigger-x')
    expect(panelY).toHaveAttribute('aria-labelledby', 'accordion-trigger-y')
  })

  it('closed panel has the HTML hidden attribute', () => {
    render(<Accordion items={TWO_ITEMS} />)
    const panelX = document.getElementById('accordion-panel-x')
    expect(panelX).toHaveAttribute('hidden')
  })

  it('open panel does not have the hidden attribute', () => {
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x']} />)
    const panelX = document.getElementById('accordion-panel-x')
    expect(panelX).not.toHaveAttribute('hidden')
  })

  it('chevron span has aria-hidden="true"', () => {
    render(<Accordion items={[{ id: 'z', trigger: 'Z', content: 'Content Z' }]} />)
    // The chevron is a sibling of triggerLabel inside the button
    const btn = screen.getByRole('button', { name: 'Z' })
    const hiddenSpans = within(btn).getAllByRole('presentation', { hidden: true })
    // aria-hidden spans are not exposed as any role — query by attribute directly
    const ariaHiddenEl = btn.querySelector('[aria-hidden="true"]')
    expect(ariaHiddenEl).not.toBeNull()
  })
})

// ---------------------------------------------------------------------------
// 5. data-state attribute
// ---------------------------------------------------------------------------

describe('Accordion — data-state attribute', () => {
  it('item wrapper has data-state="closed" when not open', () => {
    render(<Accordion items={TWO_ITEMS} data-testid="root" />)
    // Each item's wrapper div carries data-state
    const items = screen.getByTestId('root').querySelectorAll('[data-state]')
    expect(items[0]).toHaveAttribute('data-state', 'closed')
  })

  it('item wrapper has data-state="open" when expanded', () => {
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x']} data-testid="root" />)
    const items = screen.getByTestId('root').querySelectorAll('[data-state]')
    expect(items[0]).toHaveAttribute('data-state', 'open')
    expect(items[1]).toHaveAttribute('data-state', 'closed')
  })
})

// ---------------------------------------------------------------------------
// 6. Toggle — uncontrolled (click interaction)
// ---------------------------------------------------------------------------

describe('Accordion — toggle (uncontrolled)', () => {
  it('opens an item when the trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} />)
    const btnX = screen.getByRole('button', { name: 'Panel X' })

    await user.click(btnX)

    expect(btnX).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById('accordion-panel-x')).not.toHaveAttribute('hidden')
  })

  it('closes an open item when the trigger is clicked again', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x']} />)
    const btnX = screen.getByRole('button', { name: 'Panel X' })

    await user.click(btnX)

    expect(btnX).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById('accordion-panel-x')).toHaveAttribute('hidden')
  })

  it('reveals item content text when opened', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} />)

    await user.click(screen.getByRole('button', { name: 'Panel X' }))

    expect(screen.getByText('Content X')).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// 7. Keyboard interaction — Enter / Space toggle
// ---------------------------------------------------------------------------

describe('Accordion — keyboard toggle (Enter / Space)', () => {
  it('opens an item with Enter key', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} />)
    const btnX = screen.getByRole('button', { name: 'Panel X' })

    btnX.focus()
    await user.keyboard('{Enter}')

    expect(btnX).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes an open item with Enter key', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x']} />)
    const btnX = screen.getByRole('button', { name: 'Panel X' })

    btnX.focus()
    await user.keyboard('{Enter}')

    expect(btnX).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens an item with Space key', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} />)
    const btnX = screen.getByRole('button', { name: 'Panel X' })

    btnX.focus()
    await user.keyboard(' ')

    expect(btnX).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes an open item with Space key', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x']} />)
    const btnX = screen.getByRole('button', { name: 'Panel X' })

    btnX.focus()
    await user.keyboard(' ')

    expect(btnX).toHaveAttribute('aria-expanded', 'false')
  })
})

// ---------------------------------------------------------------------------
// 8. Keyboard interaction — ArrowDown / ArrowUp / Home / End navigation
// ---------------------------------------------------------------------------

describe('Accordion — keyboard navigation', () => {
  it('ArrowDown moves focus from first to second trigger', async () => {
    const user = userEvent.setup()
    render(<Accordion items={THREE_ITEMS} />)
    const [btnA, btnB] = screen.getAllByRole('button')

    btnA.focus()
    await user.keyboard('{ArrowDown}')

    expect(document.activeElement).toBe(btnB)
  })

  it('ArrowDown wraps from last trigger to first', async () => {
    const user = userEvent.setup()
    render(<Accordion items={THREE_ITEMS} />)
    const [btnA, , btnC] = screen.getAllByRole('button')

    btnC.focus()
    await user.keyboard('{ArrowDown}')

    expect(document.activeElement).toBe(btnA)
  })

  it('ArrowUp moves focus from second to first trigger', async () => {
    const user = userEvent.setup()
    render(<Accordion items={THREE_ITEMS} />)
    const [btnA, btnB] = screen.getAllByRole('button')

    btnB.focus()
    await user.keyboard('{ArrowUp}')

    expect(document.activeElement).toBe(btnA)
  })

  it('ArrowUp wraps from first trigger to last', async () => {
    const user = userEvent.setup()
    render(<Accordion items={THREE_ITEMS} />)
    const [btnA, , btnC] = screen.getAllByRole('button')

    btnA.focus()
    await user.keyboard('{ArrowUp}')

    expect(document.activeElement).toBe(btnC)
  })

  it('Home moves focus to the first trigger from anywhere', async () => {
    const user = userEvent.setup()
    render(<Accordion items={THREE_ITEMS} />)
    const [btnA, , btnC] = screen.getAllByRole('button')

    btnC.focus()
    await user.keyboard('{Home}')

    expect(document.activeElement).toBe(btnA)
  })

  it('End moves focus to the last trigger from anywhere', async () => {
    const user = userEvent.setup()
    render(<Accordion items={THREE_ITEMS} />)
    const [btnA, , btnC] = screen.getAllByRole('button')

    btnA.focus()
    await user.keyboard('{End}')

    expect(document.activeElement).toBe(btnC)
  })

  it('ArrowDown skips disabled items', async () => {
    const user = userEvent.setup()
    const items: AccordionItem[] = [
      { id: 'a', trigger: 'Panel A', content: 'A' },
      { id: 'b', trigger: 'Panel B', content: 'B', disabled: true },
      { id: 'c', trigger: 'Panel C', content: 'C' },
    ]
    render(<Accordion items={items} />)
    const [btnA, , btnC] = screen.getAllByRole('button', { hidden: true })

    btnA.focus()
    await user.keyboard('{ArrowDown}')

    // Should jump over disabled 'b' to 'c'
    expect(document.activeElement).toBe(btnC)
  })

  it('ArrowUp skips disabled items', async () => {
    const user = userEvent.setup()
    const items: AccordionItem[] = [
      { id: 'a', trigger: 'Panel A', content: 'A' },
      { id: 'b', trigger: 'Panel B', content: 'B', disabled: true },
      { id: 'c', trigger: 'Panel C', content: 'C' },
    ]
    render(<Accordion items={items} />)
    const [btnA, , btnC] = screen.getAllByRole('button', { hidden: true })

    btnC.focus()
    await user.keyboard('{ArrowUp}')

    // Should jump back over disabled 'b' to 'a'
    expect(document.activeElement).toBe(btnA)
  })

  it('Home skips disabled first item and focuses first enabled trigger', async () => {
    const user = userEvent.setup()
    const items: AccordionItem[] = [
      { id: 'a', trigger: 'Panel A', content: 'A', disabled: true },
      { id: 'b', trigger: 'Panel B', content: 'B' },
      { id: 'c', trigger: 'Panel C', content: 'C' },
    ]
    render(<Accordion items={items} />)
    const [, btnB, btnC] = screen.getAllByRole('button', { hidden: true })

    btnC.focus()
    await user.keyboard('{Home}')

    expect(document.activeElement).toBe(btnB)
  })

  it('End skips disabled last item and focuses last enabled trigger', async () => {
    const user = userEvent.setup()
    const items: AccordionItem[] = [
      { id: 'a', trigger: 'Panel A', content: 'A' },
      { id: 'b', trigger: 'Panel B', content: 'B' },
      { id: 'c', trigger: 'Panel C', content: 'C', disabled: true },
    ]
    render(<Accordion items={items} />)
    const [btnA, btnB] = screen.getAllByRole('button', { hidden: true })

    btnA.focus()
    await user.keyboard('{End}')

    expect(document.activeElement).toBe(btnB)
  })
})

// ---------------------------------------------------------------------------
// 9. allowMultiple behavior
// ---------------------------------------------------------------------------

describe('Accordion — allowMultiple', () => {
  it('closes the previously open item when allowMultiple=false (default)', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x']} />)

    await user.click(screen.getByRole('button', { name: 'Panel Y' }))

    expect(screen.getByRole('button', { name: 'Panel X' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Panel Y' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('keeps both items open when allowMultiple=true', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} allowMultiple defaultOpenIds={['x']} />)

    await user.click(screen.getByRole('button', { name: 'Panel Y' }))

    expect(screen.getByRole('button', { name: 'Panel X' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Panel Y' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('opening all three items works with allowMultiple=true', async () => {
    const user = userEvent.setup()
    render(<Accordion items={THREE_ITEMS} allowMultiple />)

    for (const label of ['Panel A', 'Panel B', 'Panel C']) {
      await user.click(screen.getByRole('button', { name: label }))
    }

    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('allowMultiple=true still allows closing an open item', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} allowMultiple defaultOpenIds={['x', 'y']} />)

    await user.click(screen.getByRole('button', { name: 'Panel X' }))

    expect(screen.getByRole('button', { name: 'Panel X' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Panel Y' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})

// ---------------------------------------------------------------------------
// 10. defaultOpenIds — uncontrolled initial state
// ---------------------------------------------------------------------------

describe('Accordion — defaultOpenIds (uncontrolled)', () => {
  it('opens specified items on first render', () => {
    render(<Accordion items={THREE_ITEMS} allowMultiple defaultOpenIds={['a', 'c']} />)

    expect(screen.getByRole('button', { name: 'Panel A' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Panel B' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Panel C' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('uses an empty array when defaultOpenIds is omitted', () => {
    render(<Accordion items={TWO_ITEMS} />)
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toHaveAttribute('aria-expanded', 'false')
    })
  })
})

// ---------------------------------------------------------------------------
// 11. Controlled mode (openIds + onOpenChange)
// ---------------------------------------------------------------------------

describe('Accordion — controlled mode', () => {
  it('reflects openIds prop: item is open when its id is in openIds', () => {
    render(<Accordion items={TWO_ITEMS} openIds={['x']} onOpenChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Panel X' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Panel Y' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('calls onOpenChange with the new set of ids when a trigger is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Accordion items={TWO_ITEMS} openIds={[]} onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Panel X' }))

    expect(onOpenChange).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(['x'])
  })

  it('calls onOpenChange with empty array when the currently open item is closed', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Accordion items={TWO_ITEMS} openIds={['x']} onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Panel X' }))

    expect(onOpenChange).toHaveBeenCalledWith([])
  })

  it('does not mutate internal state when controlled: ui stays as openIds dictates', async () => {
    const user = userEvent.setup()
    // openIds is pinned to [] so clicking should NOT toggle the UI
    render(<Accordion items={TWO_ITEMS} openIds={[]} onOpenChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Panel X' }))

    // Still closed because the parent did not update openIds
    expect(screen.getByRole('button', { name: 'Panel X' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('calls onOpenChange with both ids when allowMultiple and a second item is opened', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Accordion
        items={TWO_ITEMS}
        openIds={['x']}
        onOpenChange={onOpenChange}
        allowMultiple
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Panel Y' }))

    expect(onOpenChange).toHaveBeenCalledWith(['x', 'y'])
  })
})

// ---------------------------------------------------------------------------
// 12. Disabled items
// ---------------------------------------------------------------------------

describe('Accordion — disabled items', () => {
  const ITEMS_WITH_DISABLED: AccordionItem[] = [
    { id: 'p', trigger: 'Panel P', content: 'Content P' },
    { id: 'q', trigger: 'Panel Q', content: 'Content Q', disabled: true },
  ]

  it('sets the HTML disabled attribute on the trigger button', () => {
    render(<Accordion items={ITEMS_WITH_DISABLED} />)
    expect(screen.getByRole('button', { name: 'Panel Q', hidden: true })).toBeDisabled()
  })

  it('sets aria-disabled="true" on the trigger button', () => {
    render(<Accordion items={ITEMS_WITH_DISABLED} />)
    // disabled triggers may be hidden from the a11y tree; query by id instead
    const btn = document.getElementById('accordion-trigger-q')
    expect(btn).toHaveAttribute('aria-disabled', 'true')
  })

  it('applies styles.itemDisabled class to the item wrapper', () => {
    render(<Accordion items={ITEMS_WITH_DISABLED} data-testid="root" />)
    const root = screen.getByTestId('root')
    const itemWrappers = root.querySelectorAll('[data-state]')
    // Second item (index 1) is the disabled one
    expect(itemWrappers[1].className).toContain(styles.itemDisabled)
  })

  it('does not toggle a disabled item when clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Accordion items={ITEMS_WITH_DISABLED} onOpenChange={onOpenChange} openIds={[]} />,
    )

    // Attempt click (the button is disabled so the browser prevents it)
    await user.click(document.getElementById('accordion-trigger-q')!, {
      skipPointerEventsCheck: true,
    })

    expect(onOpenChange).not.toHaveBeenCalled()
    expect(document.getElementById('accordion-trigger-q')).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('does not apply itemDisabled class to enabled items', () => {
    render(<Accordion items={ITEMS_WITH_DISABLED} data-testid="root" />)
    const root = screen.getByTestId('root')
    const itemWrappers = root.querySelectorAll('[data-state]')
    expect(itemWrappers[0].className).not.toContain(styles.itemDisabled)
  })
})

// ---------------------------------------------------------------------------
// 13. Variant — className application on the root element
// ---------------------------------------------------------------------------

describe('Accordion — variant class application', () => {
  const variants: AccordionVariant[] = ['default', 'bordered', 'flush']

  variants.forEach((variant) => {
    it(`applies styles["variant-${variant}"] when variant="${variant}"`, () => {
      render(<Accordion items={TWO_ITEMS} variant={variant} data-testid="root" />)
      expect(screen.getByTestId('root').className).toContain(
        styles[`variant-${variant}` as keyof typeof styles],
      )
    })
  })

  it('defaults to variant="default"', () => {
    render(<Accordion items={TWO_ITEMS} data-testid="root" />)
    expect(screen.getByTestId('root').className).toContain(styles['variant-default'])
  })

  it('does not apply other variant classes for a given variant', () => {
    render(<Accordion items={TWO_ITEMS} variant="bordered" data-testid="root" />)
    const cls = screen.getByTestId('root').className
    expect(cls).not.toContain(styles['variant-default'])
    expect(cls).not.toContain(styles['variant-flush'])
  })
})

// ---------------------------------------------------------------------------
// 14. Size — className application on the root element
// ---------------------------------------------------------------------------

describe('Accordion — size class application', () => {
  const sizes: AccordionSize[] = ['sm', 'md', 'lg']

  sizes.forEach((size) => {
    it(`applies styles["size-${size}"] when size="${size}"`, () => {
      render(<Accordion items={TWO_ITEMS} size={size} data-testid="root" />)
      expect(screen.getByTestId('root').className).toContain(
        styles[`size-${size}` as keyof typeof styles],
      )
    })
  })

  it('defaults to size="md"', () => {
    render(<Accordion items={TWO_ITEMS} data-testid="root" />)
    expect(screen.getByTestId('root').className).toContain(styles['size-md'])
  })

  it('does not apply other size classes for a given size', () => {
    render(<Accordion items={TWO_ITEMS} size="sm" data-testid="root" />)
    const cls = screen.getByTestId('root').className
    expect(cls).not.toContain(styles['size-md'])
    expect(cls).not.toContain(styles['size-lg'])
  })
})

// ---------------------------------------------------------------------------
// 15. itemOpen class — applied only to open item wrappers
// ---------------------------------------------------------------------------

describe('Accordion — itemOpen class', () => {
  it('applies styles.itemOpen to the open item wrapper', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} data-testid="root" />)
    const root = screen.getByTestId('root')

    await user.click(screen.getByRole('button', { name: 'Panel X' }))

    const itemWrappers = root.querySelectorAll('[data-state]')
    expect(itemWrappers[0].className).toContain(styles.itemOpen)
  })

  it('does not apply styles.itemOpen to closed items', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} data-testid="root" />)
    const root = screen.getByTestId('root')

    await user.click(screen.getByRole('button', { name: 'Panel X' }))

    const itemWrappers = root.querySelectorAll('[data-state]')
    // Second item (Y) should remain closed
    expect(itemWrappers[1].className).not.toContain(styles.itemOpen)
  })

  it('removes styles.itemOpen when an item is closed', async () => {
    const user = userEvent.setup()
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x']} data-testid="root" />)
    const root = screen.getByTestId('root')

    await user.click(screen.getByRole('button', { name: 'Panel X' }))

    const itemWrappers = root.querySelectorAll('[data-state]')
    expect(itemWrappers[0].className).not.toContain(styles.itemOpen)
  })
})

// ---------------------------------------------------------------------------
// 16. Prop forwarding — ...rest reaches the root DOM element
// ---------------------------------------------------------------------------

describe('Accordion — prop forwarding', () => {
  it('forwards data-testid to the root <div>', () => {
    render(<Accordion items={TWO_ITEMS} data-testid="accordion-root" />)
    expect(screen.getByTestId('accordion-root')).toBeInTheDocument()
  })

  it('forwards arbitrary data-* attributes', () => {
    render(<Accordion items={TWO_ITEMS} data-testid="root" data-analytics="faq-section" />)
    expect(screen.getByTestId('root')).toHaveAttribute('data-analytics', 'faq-section')
  })

  it('merges an external className with internal classes', () => {
    render(<Accordion items={TWO_ITEMS} className="my-custom" data-testid="root" />)
    const cls = screen.getByTestId('root').className
    expect(cls).toContain('my-custom')
    expect(cls).toContain(styles.accordion)
  })

  it('always carries styles.accordion on the root element', () => {
    render(<Accordion items={TWO_ITEMS} data-testid="root" />)
    expect(screen.getByTestId('root').className).toContain(styles.accordion)
  })

  it('forwards aria-label to the root element', () => {
    render(<Accordion items={TWO_ITEMS} aria-label="FAQ" data-testid="root" />)
    expect(screen.getByTestId('root')).toHaveAttribute('aria-label', 'FAQ')
  })

  it('forwards id to the root element', () => {
    render(<Accordion items={TWO_ITEMS} id="main-accordion" data-testid="root" />)
    expect(screen.getByTestId('root')).toHaveAttribute('id', 'main-accordion')
  })
})

// ---------------------------------------------------------------------------
// 17. onOpenChange callback
// ---------------------------------------------------------------------------

describe('Accordion — onOpenChange callback', () => {
  it('fires onOpenChange on first open', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Accordion items={TWO_ITEMS} onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Panel X' }))

    expect(onOpenChange).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(['x'])
  })

  it('fires onOpenChange on close with empty array (single-open)', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Accordion items={TWO_ITEMS} defaultOpenIds={['x']} onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Panel X' }))

    expect(onOpenChange).toHaveBeenCalledWith([])
  })

  it('fires onOpenChange with the new single-open id when a different item is opened (allowMultiple=false)', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Accordion items={TWO_ITEMS} defaultOpenIds={['x']} onOpenChange={onOpenChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Panel Y' }))

    expect(onOpenChange).toHaveBeenCalledWith(['y'])
  })

  it('does not fire onOpenChange when a disabled item trigger is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const items: AccordionItem[] = [
      { id: 'a', trigger: 'Panel A', content: 'A', disabled: true },
    ]
    render(<Accordion items={items} onOpenChange={onOpenChange} />)

    await user.click(document.getElementById('accordion-trigger-a')!, {
      skipPointerEventsCheck: true,
    })

    expect(onOpenChange).not.toHaveBeenCalled()
  })
})
