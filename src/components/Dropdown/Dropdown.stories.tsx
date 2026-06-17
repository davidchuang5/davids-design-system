import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './Dropdown'

const items = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'divider-1', label: '', divider: true },
  { id: 'delete', label: 'Delete' },
]

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  args: { label: 'Actions', items },
}
export default meta

type Story = StoryObj<typeof Dropdown>

export const Default: Story = {}

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Outline: Story = { args: { variant: 'outline' } }

export const Disabled: Story = { args: { disabled: true } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

export const TopStart: Story = { args: { placement: 'top-start' } }
