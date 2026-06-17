import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  component: Modal,
  args: {
    open: true,
    onClose: () => {},
    header: 'Confirm action',
    children: 'Are you sure you want to proceed? This cannot be undone.',
    footer: <button>Confirm</button>,
  },
}
export default meta

type Story = StoryObj<typeof Modal>

export const Default: Story = {}

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

export const NoBackdropClose: Story = { args: { disableBackdropClose: true } }

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <button onClick={() => setOpen(true)}>Open modal</button>
        <Modal open={open} onClose={() => setOpen(false)} header="Interactive modal">
          Press Escape or click the backdrop to close.
        </Modal>
      </>
    )
  },
}
