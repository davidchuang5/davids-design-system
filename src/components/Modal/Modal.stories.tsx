import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'
import { useState } from 'react'

const meta: Meta<typeof Modal> = {
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
    onClose: {
      description: 'Callback when the modal should close',
    },
    title: {
      control: 'text',
      description: 'Title to display in the modal header',
    },
    children: {
      description: 'Content to display in the modal body',
    },
    footer: {
      description: 'Content to display in the modal footer',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether pressing Escape closes the modal',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Whether clicking the overlay closes the modal',
    },
  },
}

export default meta

type Story = StoryObj<typeof Modal>

function ModalWithState(props: Parameters<typeof Modal>[0]) {
  const [open, setOpen] = useState(props.open ?? false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal {...props} open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export const Default: Story = {
  render: (args) => (
    <ModalWithState
      {...args}
      title="Modal Title"
      onClose={() => {}}
    >
      This is the modal body content.
    </ModalWithState>
  ),
}

export const WithFooter: Story = {
  render: (args) => (
    <ModalWithState
      {...args}
      title="Confirm Action"
      footer={
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" style={{ padding: '0.5rem 1rem' }}>
            Cancel
          </button>
          <button
            type="button"
            style={{ padding: '0.5rem 1rem', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
          >
            Confirm
          </button>
        </div>
      }
      onClose={() => {}}
    >
      Are you sure you want to proceed with this action?
    </ModalWithState>
  ),
}

export const CloseOnEscapeDisabled: Story = {
  render: (args) => (
    <ModalWithState
      {...args}
      title="Cannot Close with Escape"
      closeOnEscape={false}
      onClose={() => {}}
    >
      This modal cannot be closed by pressing Escape. You must click the close button or overlay.
    </ModalWithState>
  ),
}

export const CloseOnOverlayClickDisabled: Story = {
  render: (args) => (
    <ModalWithState
      {...args}
      title="Cannot Close by Clicking Overlay"
      closeOnOverlayClick={false}
      onClose={() => {}}
    >
      This modal cannot be closed by clicking the overlay. You must click the close button or press Escape.
    </ModalWithState>
  ),
}

export const LongContent: Story = {
  render: (args) => (
    <ModalWithState
      {...args}
      title="Modal with Long Content"
      onClose={() => {}}
    >
      <div style={{ whiteSpace: 'pre-wrap' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
        <br />
        <br />
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <br />
        <br />
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo.
      </div>
    </ModalWithState>
  ),
}

export const WithoutTitle: Story = {
  render: (args) => (
    <ModalWithState
      {...args}
      footer={
        <button type="button" style={{ padding: '0.5rem 1rem' }}>
          Close
        </button>
      }
      onClose={() => {}}
    >
      This modal has no title, just body and footer content.
    </ModalWithState>
  ),
}

export const NestedContent: Story = {
  render: (args) => (
    <ModalWithState
      {...args}
      title="Settings"
      footer={
        <button type="button" style={{ padding: '0.5rem 1rem' }}>
          Save
        </button>
      }
      onClose={() => {}}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
          />
        </div>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
          />
        </div>
      </div>
    </ModalWithState>
  ),
}
