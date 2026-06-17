import type { Meta, StoryObj } from '@storybook/react'
import { Accordion } from './Accordion'

const items = [
  { id: '1', header: 'What is a design system?', content: 'A design system is a collection of reusable components guided by clear standards.' },
  { id: '2', header: 'Why use tokens?', content: 'Tokens abstract raw values so changes propagate consistently across every component.' },
  { id: '3', header: 'Can items be disabled?', content: 'Yes — set disabled: true on any AccordionItem.', disabled: true },
]

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  args: { items, defaultExpandedIds: ['1'] },
}
export default meta

type Story = StoryObj<typeof Accordion>

export const Default: Story = {}

export const Multiple: Story = {
  args: { selectionMode: 'multiple', defaultExpandedIds: ['1', '2'] },
}

export const Bordered: Story = { args: { variant: 'bordered' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }
