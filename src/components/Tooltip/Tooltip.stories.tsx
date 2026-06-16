import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tooltip } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  args: {
    content: 'Helpful tooltip text',
    children: 'Hover over me',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '100px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {}

export const Top: Story = {
  args: {
    placement: 'top',
    content: 'This is a top tooltip',
  },
}

export const Right: Story = {
  args: {
    placement: 'right',
    content: 'This is a right tooltip',
  },
}

export const Bottom: Story = {
  args: {
    placement: 'bottom',
    content: 'This is a bottom tooltip',
  },
}

export const Left: Story = {
  args: {
    placement: 'left',
    content: 'This is a left tooltip',
  },
}

export const WithShowDelay: Story = {
  args: {
    content: 'Appears after 500ms',
    showDelay: 500,
  },
}

export const WithHideDelay: Story = {
  args: {
    content: 'Disappears after 500ms',
    hideDelay: 500,
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close Tooltip' : 'Open Tooltip'}
        </button>
        <Tooltip {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
          Click the button to control me
        </Tooltip>
      </div>
    )
  },
  args: {
    content: 'Controlled by external state',
  },
}

export const LongContent: Story = {
  args: {
    content:
      'This is a longer tooltip with more text that demonstrates word wrapping in tooltips',
    placement: 'top',
  },
}
