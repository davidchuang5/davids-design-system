import React from 'react'
import styles from './Card.module.css'
import type {
  CardProps,
  CardSize,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from './types'

// ---------------------------------------------------------------------------
// Internal helper — resolves the size class suffix for sub-components
// ---------------------------------------------------------------------------
function sizeClass(
  base: string,
  size: CardSize,
  map: Record<CardSize, string>,
): string {
  return map[size] ?? map['md']
}

const headerSizeMap: Record<CardSize, string> = {
  sm: styles['header-sm'],
  md: styles['header-md'],
  lg: styles['header-lg'],
}

const bodySizeMap: Record<CardSize, string> = {
  sm: styles['body-sm'],
  md: styles['body-md'],
  lg: styles['body-lg'],
}

const footerSizeMap: Record<CardSize, string> = {
  sm: styles['footer-sm'],
  md: styles['footer-md'],
  lg: styles['footer-lg'],
}

const elevationMap = {
  flat: styles['elevation-flat'],
  raised: styles['elevation-raised'],
  floating: styles['elevation-floating'],
}

// ---------------------------------------------------------------------------
// CardHeader
// ---------------------------------------------------------------------------
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    const classes = [
      styles.header,
      sizeClass('header', size, headerSizeMap),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  },
)
CardHeader.displayName = 'CardHeader'

// ---------------------------------------------------------------------------
// CardBody
// ---------------------------------------------------------------------------
const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    const classes = [
      styles.body,
      sizeClass('body', size, bodySizeMap),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  },
)
CardBody.displayName = 'CardBody'

// ---------------------------------------------------------------------------
// CardFooter
// ---------------------------------------------------------------------------
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    const classes = [
      styles.footer,
      sizeClass('footer', size, footerSizeMap),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  },
)
CardFooter.displayName = 'CardFooter'

// ---------------------------------------------------------------------------
// Card (root)
// ---------------------------------------------------------------------------
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      elevation = 'raised',
      size = 'md',
      padded = false,
      clickable = false,
      hoverable = false,
      className,
      children,
      onClick,
      onKeyDown,
      tabIndex,
      role,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    // When clickable, inject keyboard handler so Enter/Space fire onClick
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
        }
        onKeyDown?.(e)
      },
      [clickable, onClick, onKeyDown],
    )

    // Propagate size to direct CardHeader / CardBody / CardFooter children
    // so consumers only need to set size on <Card> when using the compound API.
    const childrenWithSize = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child
      const displayName = (child.type as { displayName?: string }).displayName
      if (
        displayName === 'CardHeader' ||
        displayName === 'CardBody' ||
        displayName === 'CardFooter'
      ) {
        // Only inject size if the child has not already received one
        const childProps = child.props as { size?: CardSize }
        if (!childProps.size) {
          return React.cloneElement(child, { size } as Partial<typeof child.props>)
        }
      }
      return child
    })

    const classes = [
      styles.card,
      elevationMap[elevation],
      padded ? styles.padded : undefined,
      clickable ? styles.clickable : undefined,
      !clickable && hoverable ? styles.hoverable : undefined,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        className={classes}
        role={clickable ? (role ?? 'button') : role}
        tabIndex={clickable ? (tabIndex ?? 0) : tabIndex}
        aria-label={ariaLabel}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {childrenWithSize}
      </div>
    )
  },
)
Card.displayName = 'Card'

// ---------------------------------------------------------------------------
// Attach sub-components as static properties for compound usage
// e.g. <Card.Header> <Card.Body> <Card.Footer>
// ---------------------------------------------------------------------------
const CardNamespace = Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})

export { CardNamespace as Card, CardHeader, CardBody, CardFooter }
export default CardNamespace
