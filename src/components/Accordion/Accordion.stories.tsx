import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Accordion } from './Accordion'

// ---------------------------------------------------------------------------
// Shared sample items
// ---------------------------------------------------------------------------

const baseItems = [
  {
    id: 'item-1',
    trigger: 'What is puma-ui?',
    content:
      'puma-ui is a warm-neutral enterprise design system built on React and CSS Modules, following WAI-ARIA patterns for accessibility.',
  },
  {
    id: 'item-2',
    trigger: 'How do I install it?',
    content:
      'Run `npm install puma-ui` in your project, then import the CSS bundle and any components you need from the package entry point.',
  },
  {
    id: 'item-3',
    trigger: 'Is dark mode supported?',
    content:
      'Yes. All colours are exposed as CSS custom properties (`--ds-*`) so you can override them in a `.dark` class or `prefers-color-scheme` media query.',
  },
]

const itemsWithDisabled = [
  baseItems[0],
  {
    id: 'item-2-disabled',
    trigger: 'This item is disabled',
    content: 'This content is unreachable because the item is disabled.',
    disabled: true,
  },
  baseItems[2],
]

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  args: {
    items: baseItems,
    variant: 'default',
    size: 'md',
    allowMultiple: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'flush'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Accordion>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** The default accordion with three items, single-open behaviour, and medium size. */
export const Default: Story = {}

/** Each item sits inside a shared outlined container separated by dividers. */
export const Bordered: Story = {
  args: {
    variant: 'bordered',
  },
}

/** Borderless layout — only a bottom divider separates each item from the next. */
export const Flush: Story = {
  args: {
    variant: 'flush',
  },
}

/** Multiple items can be expanded simultaneously. */
export const AllowMultiple: Story = {
  args: {
    allowMultiple: true,
    defaultOpenIds: ['item-1', 'item-3'],
  },
}

/** Compact padding and smaller font size using the `sm` size token. */
export const Small: Story = {
  args: {
    size: 'sm',
  },
}

/** Generous padding and larger font size using the `lg` size token. */
export const Large: Story = {
  args: {
    size: 'lg',
  },
}

/** The second item is open on initial render via `defaultOpenIds`. */
export const WithDefaultOpen: Story = {
  args: {
    defaultOpenIds: ['item-2'],
  },
}

/**
 * Fully controlled accordion. The parent component owns the open state and
 * passes it back through `openIds` + `onOpenChange`.
 */
export const Controlled: Story = {
  render: (args) => {
    const [openIds, setOpenIds] = React.useState<string[]>(['item-1'])
    return (
      <Accordion
        {...args}
        openIds={openIds}
        onOpenChange={setOpenIds}
      />
    )
  },
}

/** The middle item has `disabled: true` and cannot be toggled by the user. */
export const WithDisabledItem: Story = {
  args: {
    items: itemsWithDisabled,
    variant: 'bordered',
  },
}
