import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  component: Spinner,
  args: { label: 'Loading…' },
}
export default meta

type Story = StoryObj<typeof Spinner>

export const Default: Story = {}

export const Primary: Story = { args: { variant: 'primary' } }

export const Neutral: Story = { args: { variant: 'neutral' } }

export const OnDark: Story = {
  args: { variant: 'onDark' },
  parameters: { backgrounds: { default: 'dark' } },
}

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }
