import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input } from '../components/Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    hint: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    variant: 'default',
    size: 'medium',
    placeholder: 'Placeholder text',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    hint: 'We will never share your email with anyone.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
      <Input variant="default" label="Default" placeholder="Default input" hint="Helper text" />
      <Input variant="error" label="Error" placeholder="Error input" hint="This field is required." />
      <Input variant="success" label="Success" placeholder="Success input" hint="Looks good!" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <Input size="small" placeholder="Small" />
      <Input size="medium" placeholder="Medium" />
      <Input size="large" placeholder="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    disabled: true,
    hint: 'This field is disabled.',
  },
};
