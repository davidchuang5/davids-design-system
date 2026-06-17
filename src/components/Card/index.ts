// Named exports — component and sub-components
export { Card, CardHeader, CardBody, CardFooter } from './Card'

// Default export — compound component (Card.Header / Card.Body / Card.Footer)
export { default } from './Card'

// Type exports
export type {
  CardProps,
  CardSize,
  CardElevation,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from './types'
