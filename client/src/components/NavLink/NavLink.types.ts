import { ReactNode } from 'react'

export type NavLinkVariant = 'simple' | 'expandable'

export interface NavLinkProps {
  href: string
  children?: ReactNode
  label?: string
  icon?: ReactNode
  className?: string
  variant?: NavLinkVariant
  isActive?: boolean
  external?: boolean
}
