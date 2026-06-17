import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  args: { label: 'Message', placeholder: 'Write something…' },
}
export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {}

export const Filled: Story = { args: { variant: 'filled' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Disabled: Story = { args: { disabled: true } }

export const Required: Story = { args: { required: true } }

export const WithHelperText: Story = {
  args: { helperText: 'Maximum 500 characters.' },
}

export const WithError: Story = {
  args: { errorText: 'Message is required.' },
}

export const WithCharacterCount: Story = {
  args: { showCharacterCount: true, maxLength: 200 },
}

export const FullWidth: Story = { args: { fullWidth: true } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }
