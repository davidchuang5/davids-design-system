import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  component: Badge,
  args: { children: 'Badge' },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const Primary: Story = { args: { variant: 'primary' } }

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Success: Story = { args: { variant: 'success', children: 'Success' } }

export const Warning: Story = { args: { variant: 'warning', children: 'Warning' } }

export const Danger: Story = { args: { variant: 'danger', children: 'Danger' } }

export const Outline: Story = { args: { variant: 'outline' } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }
