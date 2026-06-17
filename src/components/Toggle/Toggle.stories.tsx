import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from './Toggle'

const meta: Meta<typeof Toggle> = {
  component: Toggle,
  args: { label: 'Enable notifications' },
}
export default meta

type Story = StoryObj<typeof Toggle>

export const Default: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

export const Disabled: Story = { args: { disabled: true } }

export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } }

export const LabelLeft: Story = { args: { labelPosition: 'left' } }

export const Small: Story = { args: { size: 'sm' } }
