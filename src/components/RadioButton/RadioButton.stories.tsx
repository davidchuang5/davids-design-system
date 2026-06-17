import type { Meta, StoryObj } from '@storybook/react'
import { RadioButton, RadioGroup } from './RadioButton'

const meta: Meta<typeof RadioButton> = {
  component: RadioButton,
  args: { label: 'Option A', name: 'demo', value: 'a' },
}
export default meta

type Story = StoryObj<typeof RadioButton>

export const Default: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

export const Disabled: Story = { args: { disabled: true } }

export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

const groupOptions = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push notification', disabled: true },
]

export const Group: StoryObj<typeof RadioGroup> = {
  render: () => (
    <RadioGroup
      label="Notification method"
      name="notification"
      options={groupOptions}
      defaultValue="email"
      onChange={() => {}}
    />
  ),
}

export const GroupHorizontal: StoryObj<typeof RadioGroup> = {
  render: () => (
    <RadioGroup
      label="Notification method"
      name="notification-h"
      options={groupOptions}
      defaultValue="email"
      orientation="horizontal"
      onChange={() => {}}
    />
  ),
}
