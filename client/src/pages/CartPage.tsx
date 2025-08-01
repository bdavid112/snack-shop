import { api } from '@api/api'
import { CartTable } from '@components/Table/CartTable'
import { CartItemResponse } from '@shared/schemas/order'
import { EntityList } from '@components/EntityList'

export const CartPage = () => {
  function isCartItemArray(data: any): data is CartItemResponse[] {
    return Array.isArray(data) && data.every((item) => typeof item.id === 'number')
  }

  return (
    <EntityList<CartItemResponse>
      title="Cart"
      fetchEntities={() =>
        api.get('/cart', { withCredentials: true }).then((res) => {
          if (!isCartItemArray(res.data)) {
            console.error('Cart API returned unexpected format', res.data)
            return []
          }
          return res.data
        })
      }
      renderListView={(cartItems, selectedIds, toggleOne, toggleAll, refresh) => (
        <CartTable
          items={cartItems}
          selectedIds={selectedIds}
          onToggleOne={toggleOne}
          onToggleAll={toggleAll}
          refreshCart={refresh}
        />
      )}
      defaultView="list"
      allowToggle={false}
    />
  )
}

export default CartPage
