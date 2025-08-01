import { ProductCardProps } from './Card.types'
import { Card, CardBody, CardFooter, CardHeader } from './Card'
import { QuantityStepper } from '@components/QuantityStepper'
import clsx from 'clsx'
import { Button } from '@components/Button'
import { useState } from 'react'
import { getStockInfo } from '@utils/stock'
import { useCartApi } from '@hooks/useCartApi'

// Main component
export const ProductCard = ({ product, className, ...props }: ProductCardProps) => {
  const { id, name, price, stock, description, discount, image_url } = product
  const [quantity, setQuantity] = useState(1)
  const { addItemToCart } = useCartApi()

  const handleAddToCart = async () => {
    try {
      await addItemToCart(id, quantity)
      alert('Added to cart!')
    } catch {
      alert('Failed to add to cart.')
    }
  }

  // Give stock information to users
  const remainingStock = stock - quantity
  const stockInfo = getStockInfo(remainingStock)

  return (
    <Card variant="elevated" className={clsx('w-[22.5rem]', className)} {...props}>
      <CardHeader>
        {image_url && (
          <img
            src={`http://localhost:3000/${image_url}`}
            alt={name}
            className="object-cover w-[300px] h-[300px] mix-blend-darken mb-6"
          />
        )}
        <div className="text-pretty">
          <p className="h-12 mb-0 font-bold text-h6 leading-h6 ">{name}</p>
          <small className="text-[var(--zui-text-secondary)]">{description}</small>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex justify-end">
          <span className={clsx('text-right text-caption leading-caption', stockInfo.color)}>
            {stockInfo.text}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex gap-2">
            <p className="mb-0 font-semibold">
              ${((price * quantity * (1 - (discount ?? 0) / 100)) / 100).toFixed(2)}
            </p>

            {discount && discount > 0 && (
              <p className="mb-0 text-[var(--zui-text-muted)] line-through">
                ${((price * quantity) / 100).toFixed(2)}
              </p>
            )}
          </div>
          <QuantityStepper value={quantity} max={stock} onChange={setQuantity} />
        </div>
      </CardBody>
      <CardFooter>
        <Button shape="pill" size="sm" className="w-full" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
