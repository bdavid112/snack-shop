import { ReactNode } from 'react'

export type TabsVariant = 'outlined' | 'elevated' | 'ghost'

export interface TabsProps {
  variant?: TabsVariant
  children?: ReactNode
  className?: string
}
