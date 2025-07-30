import { HTMLAttributes, ReactNode } from 'react'

export type CardVariant = 'outlined' | 'elevated'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  children?: ReactNode
}
