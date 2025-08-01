import React from 'react'
import {
  FieldConfig,
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableRow,
} from '@components/Table'
import { Button } from '@components/Button'
import { useEditableEntities } from '@hooks/useEditableEntities'
import { useOrdersApi } from '@hooks/useOrdersApi'
import { DataRow } from './DataRow'
import { EditableRow } from './EditableRow'
import { OrderResponse } from '@shared/schemas/order'

interface OrdersTableProps {
  orders: OrderResponse[]
  selectedIds: number[]
  onToggleOne: (id: number) => void
  onToggleAll: () => void
  refreshOrders: () => void
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  selectedIds,
  onToggleOne,
  onToggleAll,
  refreshOrders,
}) => {
  const { editingId, editableEntities, startEditing, setField, cancelEditing } =
    useEditableEntities<OrderResponse>(orders)

  const { updateOrder, createOrder, deleteOrders } = useOrdersApi()

  const handleSave = async (id: number) => {
    const updated = editableEntities[id]
    if (!updated) return

    const formData = new FormData()
    for (const key in updated) {
      const value = (updated as any)[key]
      if (value instanceof File) {
        formData.append(key, value)
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    }

    try {
      await updateOrder(id, formData)
      refreshOrders()
      cancelEditing()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (selectedIds.length === 0) return
    try {
      await deleteOrders(selectedIds)
      refreshOrders()
    } catch (error) {
      console.error(error)
    }
  }

  const orderFields: FieldConfig<OrderResponse>[] = [
    { key: 'user_id', placeholder: 'User ID', widthClass: 'flex-[2]' },
    {
      key: 'total',
      inputType: 'number',
      placeholder: 'Total Price (cents)',
      widthClass: 'flex-[1]',
    },
  ]

  return (
    <form>
      <Table variant="elevated">
        <TableHeader
          allSelected={orders.length > 0 && selectedIds.length === orders.length}
          onSelectAll={onToggleAll}
        >
          <TableRow bulk header>
            <td className="flex-[0.75]"></td>
            <th className="flex-[2]">User ID</th>
            <th className="flex-[1]">Total Price</th>
            <th className="flex-[0.5]"></th>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Existing orders */}
          {orders
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((order) => {
              const editing = editingId === order.id
              const editableData = editableEntities[order.id] || order
              const selected = selectedIds.includes(order.id)

              if (editing) {
                return (
                  <EditableRow<OrderResponse>
                    key={order.id}
                    initialData={editableData}
                    fields={orderFields}
                    onSubmit={async (data, formData) => {
                      if (!order.id) return
                      const fd = formData ?? new FormData()
                      if (!formData) {
                        for (const key in data) {
                          const val = (data as any)[key]
                          if (val !== undefined && val !== null) {
                            fd.append(key, String(val))
                          }
                        }
                      }
                      await updateOrder(order.id, fd)
                      refreshOrders()
                      cancelEditing()
                    }}
                  />
                )
              }

              return (
                <DataRow<OrderResponse>
                  key={order.id}
                  item={order}
                  editing={false}
                  editableData={editableData}
                  selected={selected}
                  onSelect={() => onToggleOne(order.id)}
                  onStartEdit={() => startEditing(order.id)}
                  onCancelEdit={cancelEditing}
                  onFieldChange={setField}
                  onSave={handleSave}
                  fields={[
                    {
                      key: 'user_id',
                      widthClass: 'flex-[2]',
                      render: (value) => value ?? '',
                    },
                    {
                      key: 'total',
                      widthClass: 'flex-[1]',
                      render: (value) =>
                        typeof value === 'number' ? `$${(value / 100).toFixed(2)}` : '',
                    },
                  ]}
                />
              )
            })}
        </TableBody>

        <TableFooter>
          {orders.length > 0 && (
            <tr>
              <td className="w-full">
                <div className="flex items-center justify-between">
                  <small className="text-[var(--zui-text-secondary)]">
                    {`${selectedIds.length} of ${orders.length} selected`}
                  </small>
                  <Button
                    variant="ghost"
                    size="sm"
                    shape="pill"
                    className="text-[var(--zui-state-error)]"
                    onClick={handleDelete}
                  >
                    Remove selected order(s)
                  </Button>
                </div>
              </td>
            </tr>
          )}
        </TableFooter>
      </Table>
    </form>
  )
}
