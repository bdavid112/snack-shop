import { api } from '@api/api'
import { OrderItemResponse } from '@shared/schemas/order'

export const useCartApi = () => {
  // Fetch all cart items from /cart (GET)
  const getCartItems = async () => {
    return api.get<OrderItemResponse[]>('/cart', {
      withCredentials: true,
    })
  }

  // Update or replace the entire cart (PUT /cart)
  // Pass { items: [...] } as the payload
  const updateCart = async (items: { product_id: number; quantity: number }[]) => {
    return api.put('/cart', { items }, { withCredentials: true })
  }

  // Add or update a single item in cart
  const addItemToCart = async (product_id: number, quantity: number) => {
    try {
      const { data: currentItems } = await getCartItems()
      const itemIndex = currentItems.findIndex((item) => item?.id === product_id)

      let updatedItems
      if (itemIndex !== -1) {
        updatedItems = [...currentItems]
        updatedItems[itemIndex].quantity += quantity
      } else {
        updatedItems = [...currentItems, { product_id, quantity } as any]
      }

      await updateCart(
        updatedItems.map((item) => ({
          product_id: item.product?.id ?? item.product_id,
          quantity: item.quantity,
        }))
      )
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      throw error
    }
  }

  return { getCartItems, updateCart, addItemToCart }
}
