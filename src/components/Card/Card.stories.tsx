import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardBody, CardFooter } from './Card'

const meta: Meta<typeof Card> = {
  component: Card,
  args: {
    children: (
      <>
        <CardHeader>Header</CardHeader>
        <CardBody>Body content goes here.</CardBody>
        <CardFooter>Footer</CardFooter>
      </>
    ),
  },
}
export default meta

type Story = StoryObj<typeof Card>

export const Raised: Story = { args: { elevation: 'raised' } }

export const Flat: Story = { args: { elevation: 'flat' } }

export const Floating: Story = { args: { elevation: 'floating' } }

export const Clickable: Story = {
  args: { clickable: true, 'aria-label': 'Open card details' },
}

export const Hoverable: Story = { args: { hoverable: true } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }
