import type { Meta, StoryObj } from '@storybook/react'
import { Toast } from './Toast'

const meta: Meta<typeof Toast> = {
  component: Toast,
  args: { message: 'Your changes have been saved.', open: true, duration: null },
}
export default meta

type Story = StoryObj<typeof Toast>

export const Info: Story = { args: { variant: 'info' } }

export const Success: Story = {
  args: { variant: 'success', message: 'File uploaded successfully.' },
}

export const Warning: Story = {
  args: { variant: 'warning', message: 'Your session expires soon.' },
}

export const Error: Story = {
  args: { variant: 'error', message: 'Failed to save. Please try again.' },
}

export const WithDescription: Story = {
  args: {
    title: 'Update available',
    message: 'Version 2.1.0 is ready to install.',
    description: 'Restart the app to apply the update.',
  },
}

export const Dismissible: Story = {
  args: { closable: true, onClose: () => {} },
}

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }
