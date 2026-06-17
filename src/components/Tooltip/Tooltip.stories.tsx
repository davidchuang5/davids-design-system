import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  args: { content: 'This is a tooltip', children: <button>Hover me</button> },
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {}

export const Top: Story = { args: { placement: 'top' } }

export const Right: Story = { args: { placement: 'right' } }

export const Bottom: Story = { args: { placement: 'bottom' } }

export const Left: Story = { args: { placement: 'left' } }

export const Disabled: Story = { args: { disabled: true } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

export const AlwaysOpen: Story = { args: { open: true } }
