import { ProductCardProps } from './Card.types'
import { Card, CardBody, CardFooter, CardHeader } from './Card'
import { QuantityStepper } from '@components/QuantityStepper'
import clsx from 'clsx'
import { Button } from '@components/Button'
import { useState } from 'react'
import { getStockInfo } from '@utils/stock'

// Main component
export const ProductCard = ({ product, className, ...props }: ProductCardProps) => {
  const { name, price, stock, description, image_url } = product

  const [quantity, setQuantity] = useState(1)

  // Give stock information to users
  const remainingStock = stock - quantity
  const stockInfo = getStockInfo(remainingStock)

  return (
    <Card variant="elevated" className={clsx('w-[22.5rem]', className)} {...props}>
      <CardHeader>
        {image_url && (
          <img
            src={image_url}
            alt={name}
            className="object-cover w-[300px] h-[300px] mix-blend-darken mb-6"
          />
        )}
        <div className="text-pretty">
          <p className="mb-0 font-bold text-h6 leading-h6">{name}</p>
          <small className="text-[var(--zui-text-secondary)] leading-sm">{description}</small>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex justify-end">
          <span className={clsx('text-right text-caption leading-caption', stockInfo.color)}>
            {stockInfo.text}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <p className="mb-0 font-semibold">${price / 100}</p>
          <QuantityStepper value={quantity} max={stock} onChange={setQuantity} />
        </div>
      </CardBody>
      <CardFooter>
        <Button shape="pill" size="sm" className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
