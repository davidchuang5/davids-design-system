import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  component: Input,
  args: { label: 'Email', placeholder: 'you@example.com' },
}
export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const Filled: Story = { args: { variant: 'filled' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Disabled: Story = { args: { disabled: true } }

export const Required: Story = { args: { required: true } }

export const WithHelperText: Story = {
  args: { helperText: 'We will never share your email.' },
}

export const WithError: Story = {
  args: { errorText: 'Please enter a valid email address.' },
}

export const WithLeadingIcon: Story = {
  args: { leadingIcon: <span aria-hidden>@</span> },
}

export const FullWidth: Story = { args: { fullWidth: true } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }
