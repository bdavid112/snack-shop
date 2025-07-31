import { HTMLAttributes, ReactNode } from 'react'
import { ProductResponse } from '@shared/schemas/product'

export type CardVariant = 'outlined' | 'elevated'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  children?: ReactNode
}

export interface ProductCardProps extends CardProps {
  product: ProductResponse
}
