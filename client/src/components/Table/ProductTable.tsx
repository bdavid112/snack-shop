import {
  FieldConfig,
  ProductTableProps,
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableRow,
} from '@components/Table'
import { Button } from '@components/Button'
import { useEditableEntities } from '@hooks/useEditableEntities'
import { useProductsApi } from '@hooks/useProductsApi'
import { DataRow } from './DataRow'
import { EditableRow } from './EditableRow'
import { CheckBox } from '@components/CheckBox'
import { EditableProduct, ProductCreateInput, ProductResponse } from '@shared/schemas/product'

export const ProductTable = ({
  products,
  selectedIds,
  onToggleOne,
  onToggleAll,
  refreshProducts,
}: ProductTableProps) => {
  const { editingId, editableEntities, startEditing, setField, cancelEditing } =
    useEditableEntities<EditableProduct>(products)

  const { updateProduct, createProduct, deleteProducts } = useProductsApi()

  const handleSave = async (id: number) => {
    const updated = editableEntities[id]
    if (!updated) return

    const formData = new FormData()
    formData.append('name', updated.name ?? '')
    formData.append('price', String(updated.price ?? ''))
    formData.append('stock', String(updated.stock ?? ''))
    formData.append('discount', String(updated.discount ?? ''))
    formData.append('description', updated.description ?? '')

    if (updated.imageFile) {
      formData.append('image', updated.imageFile)
    }

    try {
      await updateProduct(id, formData)
      refreshProducts()
      cancelEditing()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreate = async (data: Partial<EditableProduct>, formData?: FormData) => {
    if (!formData) {
      const fd = new FormData()
      fd.append('name', data.name ?? '')
      fd.append('price', String(data.price ?? ''))
      fd.append('stock', String(data.stock ?? ''))
      fd.append('discount', String(data.discount ?? ''))
      fd.append('description', data.description ?? '')

      await createProduct(fd)
    } else {
      await createProduct(formData)
    }
    refreshProducts()
  }

  const handleDelete = async () => {
    if (selectedIds.length === 0) return
    try {
      await deleteProducts(selectedIds)
      refreshProducts()
    } catch (error) {
      console.error(error)
    }
  }

  const productFields: FieldConfig<EditableProduct>[] = [
    {
      key: 'imageFile',
      inputType: 'file',
      accept: 'image/*',
      widthClass: 'flex-[0.75]',
    },
    {
      key: 'name',
      placeholder: 'Product name',
      widthClass: 'flex-[2]',
      defaultValue: '',
    },
    {
      key: 'description',
      placeholder: 'Product description',
      widthClass: 'flex-[2.5]',
      defaultValue: '',
    },
    {
      key: 'price',
      inputType: 'number',
      placeholder: 'Price (cents)',
      widthClass: 'flex-[1]',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'stock',
      inputType: 'number',
      placeholder: 'Stock',
      widthClass: 'flex-[1]',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'discount',
      inputType: 'number',
      placeholder: '% Off',
      widthClass: 'flex-[1]',
      defaultValue: 0,
      min: 0,
      max: 100,
    },
  ]

  return (
    <form>
      <Table variant="elevated">
        <TableHeader
          allSelected={products && selectedIds.length === products.length}
          onSelectAll={onToggleAll}
        >
          <TableRow bulk header>
            <td className="flex-[0.75]"></td>
            <th className="flex-[2]">Product</th>
            <th className="flex-[2.5]">Description</th>
            <th className="flex-[1]">Price</th>
            <th className="flex-[1]">Stock</th>
            <th className="flex-[1]">Discount</th>
            <th className="flex-[0.5]"></th>
          </TableRow>
        </TableHeader>

        <TableBody>
          <EditableRow<EditableProduct>
            initialData={{}} // empty, means new blank form
            fields={productFields}
            onSubmit={handleCreate}
          />

          {/* Existing products list */}
          {products
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => {
              const editing = editingId === product.id
              const editableData = editableEntities[product.id] || product
              const selected = selectedIds.includes(product.id)

              if (editing) {
                return (
                  <EditableRow<EditableProduct>
                    key={product.id}
                    initialData={editableData}
                    fields={productFields}
                    onSubmit={async (data, formData) => {
                      if (!product.id) return
                      await handleSave(product.id)
                    }}
                  />
                )
              }

              return (
                <DataRow<ProductResponse>
                  key={product.id}
                  item={product}
                  editing={false}
                  editableData={editableData}
                  selected={selected}
                  onSelect={() => onToggleOne(product.id)}
                  onStartEdit={() => startEditing(product.id)}
                  onCancelEdit={cancelEditing}
                  onFieldChange={setField}
                  onSave={handleSave}
                  fields={[
                    {
                      key: 'name',
                      widthClass: 'flex-[2]',
                      render: (value) => value ?? '',
                    },
                    {
                      key: 'description',
                      widthClass: 'flex-[2.5]',
                      render: (value) => value ?? '',
                    },
                    {
                      key: 'price',
                      widthClass: 'flex-[1]',
                      render: (value) => `$${(value / 100).toFixed(2)}`,
                    },
                    {
                      key: 'stock',
                      widthClass: 'flex-[1]',
                      render: (value) => `${value} pcs`,
                    },
                    {
                      key: 'discount',
                      widthClass: 'flex-[1]',
                      render: (value) => `${value ?? 0}%`,
                    },
                  ]}
                  leading={
                    <div className="flex items-center space-x-2">
                      <CheckBox
                        checked={selected}
                        onChange={() => onToggleOne(product.id)}
                        className="mr-2"
                      />
                      <img
                        className="max-w-12 mix-blend-darken"
                        src={`http://localhost:3000/${product.image_url ?? ''}`}
                        alt={product.name}
                      />
                    </div>
                  }
                />
              )
            })}
        </TableBody>

        <TableFooter>
          {products && (
            <tr>
              <td className="w-full">
                <div className="flex items-center justify-between">
                  <small className="text-[var(--zui-text-secondary)]">
                    {`${selectedIds.length} of ${products.length} selected`}
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
