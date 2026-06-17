import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  args: { value: 60, label: 'Upload progress', showValueLabel: true },
}
export default meta

type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {}

export const Success: Story = { args: { variant: 'success', value: 100 } }

export const Warning: Story = { args: { variant: 'warning', value: 75 } }

export const Danger: Story = { args: { variant: 'danger', value: 30 } }

export const Indeterminate: Story = { args: { indeterminate: true, label: 'Loading…' } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

export const NoLabel: Story = { args: { label: undefined, showValueLabel: false } }
