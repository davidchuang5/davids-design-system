import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
  args: {
    children: 'Click me',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta

type Story = StoryObj<typeof Button>

/**
 * Default button with primary variant and medium size.
 */
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
}

/**
 * Primary variant button with dark background.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
  },
}

/**
 * Secondary variant button with neutral background.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

/**
 * Ghost variant button with transparent background and border.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
}

/**
 * Danger variant button for destructive actions.
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
  },
}

/**
 * Small size button.
 */
export const Small: Story = {
  args: {
    size: 'sm',
  },
}

/**
 * Medium size button (default).
 */
export const Medium: Story = {
  args: {
    size: 'md',
  },
}

/**
 * Large size button.
 */
export const Large: Story = {
  args: {
    size: 'lg',
  },
}

/**
 * Disabled button prevents user interaction.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

/**
 * Loading state shows spinner and prevents interaction.
 */
export const Loading: Story = {
  args: {
    loading: true,
  },
}

/**
 * Loading variant with secondary styling.
 */
export const LoadingSecondary: Story = {
  args: {
    variant: 'secondary',
    loading: true,
  },
}

/**
 * Large danger button in disabled state.
 */
export const LargeDangerDisabled: Story = {
  args: {
    variant: 'danger',
    size: 'lg',
    disabled: true,
  },
}
