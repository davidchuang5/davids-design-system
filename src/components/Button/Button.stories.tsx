import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  args: { children: 'Button' },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary' } }

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Disabled: Story = { args: { disabled: true } }

export const Loading: Story = { args: { loading: true } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

export const WithLeadingIcon: Story = {
  args: { leadingIcon: <span aria-hidden>★</span>, children: 'Favourite' },
}

export const WithTrailingIcon: Story = {
  args: { trailingIcon: <span aria-hidden>→</span>, children: 'Next' },
}
