import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  args: { currentPage: 3, totalPages: 10, onPageChange: () => {} },
}
export default meta

type Story = StoryObj<typeof Pagination>

export const Default: Story = {}

export const Outline: Story = { args: { variant: 'outline' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Disabled: Story = { args: { disabled: true } }

export const ManyPages: Story = { args: { totalPages: 50, currentPage: 25 } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }
