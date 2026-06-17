import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  args: { label: 'Accept terms and conditions' },
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

export const Indeterminate: Story = { args: { indeterminate: true } }

export const Disabled: Story = { args: { disabled: true } }

export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } }

export const Error: Story = {
  args: { error: true, helperText: 'You must accept the terms to continue.' },
}

export const WithHelperText: Story = {
  args: { helperText: 'You can change this later in settings.' },
}

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }
