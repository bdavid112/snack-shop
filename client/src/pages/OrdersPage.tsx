import { api } from '@api/api'
import { OrdersTable } from '@components/Table/OrdersTable'
import { OrderResponse } from '@shared/schemas/order'
import { EntityList } from '@components/EntityList'

export const OrdersPage = () => {
  return (
    <EntityList<OrderResponse>
      title="Orders"
      fetchEntities={() =>
        api.get<OrderResponse[]>('/orders', { withCredentials: true }).then((res) => res.data)
      }
      renderListView={(orders, selectedIds, toggleOne, toggleAll, refresh) => (
        <OrdersTable
          orders={orders}
          selectedIds={selectedIds}
          onToggleOne={toggleOne}
          onToggleAll={toggleAll}
          refreshOrders={refresh}
        />
      )}
      defaultView="list"
      allowToggle={false}
    />
  )
}

export default OrdersPage
