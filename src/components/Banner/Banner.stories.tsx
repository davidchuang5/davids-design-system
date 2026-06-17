import type { Meta, StoryObj } from '@storybook/react'
import { Banner } from './Banner'

const meta: Meta<typeof Banner> = {
  component: Banner,
  args: { children: 'Your session will expire in 5 minutes.' },
}
export default meta

type Story = StoryObj<typeof Banner>

export const Info: Story = { args: { variant: 'info' } }

export const Success: Story = {
  args: { variant: 'success', children: 'Changes saved successfully.' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'This action cannot be undone.' },
}

export const Error: Story = {
  args: { variant: 'error', children: 'Failed to save changes. Please try again.' },
}

export const WithTitle: Story = {
  args: { title: 'Heads up', variant: 'info' },
}

export const Dismissible: Story = {
  args: { dismissible: true, onDismiss: () => alert('dismissed') },
}

export const WithAction: Story = {
  args: {
    title: 'Update available',
    action: <button>Refresh</button>,
  },
}

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }
