import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './Dropdown'

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  args: {
    triggerLabel: 'Select an option',
    items: [
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2' },
      { id: '3', label: 'Option 3' },
    ],
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

export const Default: Story = {}

export const WithSelectedValue: Story = {
  args: {
    value: '2',
  },
}

export const SizeSmall: Story = {
  args: {
    size: 'sm',
  },
}

export const SizeMedium: Story = {
  args: {
    size: 'md',
  },
}

export const SizeLarge: Story = {
  args: {
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const WithDisabledItem: Story = {
  args: {
    items: [
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2 (disabled)', disabled: true },
      { id: '3', label: 'Option 3' },
    ],
  },
}

export const WithManyItems: Story = {
  args: {
    items: [
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2' },
      { id: '3', label: 'Option 3' },
      { id: '4', label: 'Option 4' },
      { id: '5', label: 'Option 5' },
      { id: '6', label: 'Option 6' },
      { id: '7', label: 'Option 7' },
      { id: '8', label: 'Option 8' },
    ],
  },
}
