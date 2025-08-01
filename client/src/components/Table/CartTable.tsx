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
import { useCartApi } from '@hooks/useCartApi'
import { DataRow } from './DataRow'
import { CartItemResponse } from '@shared/schemas'

interface CartTableProps {
  items: CartItemResponse[]
  selectedIds: number[]
  onToggleOne: (id: number) => void
  onToggleAll: () => void
  refreshCart: () => void
}

export const CartTable: React.FC<CartTableProps> = ({
  items,
  selectedIds,
  onToggleOne,
  onToggleAll,
  refreshCart,
}) => {
  const { updateCart } = useCartApi()

  const handleDelete = async () => {
    if (selectedIds.length === 0) return

    try {
      const filteredItems = items.filter((item) => !selectedIds.includes(item.id))
      await updateCart(
        filteredItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        }))
      )
      refreshCart()
    } catch (error) {
      console.error(error)
    }
  }

  const cartFields: FieldConfig<CartItemResponse>[] = [
    {
      key: 'product',
      placeholder: 'Product',
      widthClass: 'flex-[3]',
      render: (_, item) => item.product?.name ?? '',
      editable: false,
    },
    {
      key: 'quantity',
      inputType: 'number',
      placeholder: 'Quantity',
      widthClass: 'flex-[1]',
      render: (_, item) => item.quantity.toString(),
      editable: false,
    },
  ]

  return (
    <form>
      <Table variant="elevated">
        <TableHeader
          allSelected={items.length > 0 && selectedIds.length === items.length}
          onSelectAll={onToggleAll}
        >
          <TableRow bulk header>
            <td className="flex-[0.75]"></td>
            <th className="flex-[3]">Product</th>
            <th className="flex-[1]">Quantity</th>
            <th className="flex-[1]">Price</th>
            <th className="flex-[1]">Subtotal</th>
            <th className="flex-[0.5]"></th>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((item) => {
              const selected = selectedIds.includes(item.id)

              return (
                <DataRow<CartItemResponse>
                  key={item.id}
                  item={item}
                  editing={false}
                  editableData={item}
                  selected={selected}
                  onSelect={() => onToggleOne(item.id)}
                  onStartEdit={() => {}}
                  onCancelEdit={() => {}}
                  onFieldChange={() => {}}
                  onSave={() => {}}
                  fields={cartFields}
                />
              )
            })}
        </TableBody>

        <TableFooter>
          {items.length > 0 && (
            <tr>
              <td className="w-full" colSpan={6}>
                <div className="flex items-center justify-between">
                  <small className="text-[var(--zui-text-secondary)]">
                    {`${selectedIds.length} of ${items.length} selected`}
                  </small>
                  <Button
                    variant="ghost"
                    size="sm"
                    shape="pill"
                    className="text-[var(--zui-state-error)]"
                    onClick={handleDelete}
                  >
                    Remove selected item(s)
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
