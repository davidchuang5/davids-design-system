import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  component: Badge,
  args: {
    children: 'Badge',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    size: 'md',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    size: 'md',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'md',
  },
}

export const SmallSize: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
  },
}

export const MediumSize: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
}

export const LargeSize: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
  },
}

export const WithLongText: Story = {
  args: {
    variant: 'success',
    size: 'md',
    children: 'Long Badge Text',
  },
}

export const AllVariantsSM: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="default" size="sm">
        Default
      </Badge>
      <Badge variant="primary" size="sm">
        Primary
      </Badge>
      <Badge variant="success" size="sm">
        Success
      </Badge>
      <Badge variant="warning" size="sm">
        Warning
      </Badge>
      <Badge variant="danger" size="sm">
        Danger
      </Badge>
    </div>
  ),
}

export const AllVariantsMD: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="default" size="md">
        Default
      </Badge>
      <Badge variant="primary" size="md">
        Primary
      </Badge>
      <Badge variant="success" size="md">
        Success
      </Badge>
      <Badge variant="warning" size="md">
        Warning
      </Badge>
      <Badge variant="danger" size="md">
        Danger
      </Badge>
    </div>
  ),
}

export const AllVariantsLG: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="default" size="lg">
        Default
      </Badge>
      <Badge variant="primary" size="lg">
        Primary
      </Badge>
      <Badge variant="success" size="lg">
        Success
      </Badge>
      <Badge variant="warning" size="lg">
        Warning
      </Badge>
      <Badge variant="danger" size="lg">
        Danger
      </Badge>
    </div>
  ),
}
