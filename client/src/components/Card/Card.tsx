import clsx from 'clsx'
import { CardProps } from './Card.types'
import { ReactNode } from 'react'

// Main component
export const Card = ({ variant = 'outlined', children, className, ...props }: CardProps) => {
  return (
    <div className={clsx('zui-card', `zui-card--${variant}`, className)} {...props}>
      {children}
    </div>
  )
}

// Subcomponents
export const CardHeader = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => <div className={className}>{children}</div>

export const CardBody = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
)

export const CardFooter = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => <div className={className}>{children}</div>
